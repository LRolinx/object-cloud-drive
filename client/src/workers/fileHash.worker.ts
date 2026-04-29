import { createBLAKE3 } from 'hash-wasm';

const PART_SIZE = 64 * 1024 * 1024;
const MAX_PARALLEL_WORKERS = 12;
const TREE_HASH_VERSION = 'object-cloud-drive-blake3-tree-v1';

type HashWorkerRequest = {
  taskId: string;
  file: File;
};

type HashWorkerResponse = {
  taskId: string;
  hash?: string;
  loaded?: number;
  total?: number;
  error?: string;
};

type HashPartResponse = {
  taskId: string;
  partIndex: number;
  hash?: string;
  loaded?: number;
  error?: string;
};

const hashTree = async (taskId: string, file: File) => {
  const workerCount = Math.min(
    MAX_PARALLEL_WORKERS,
    Math.max(2, self.navigator?.hardwareConcurrency || 4)
  );
  const partCount = Math.max(1, Math.ceil(file.size / PART_SIZE));
  const partHashes: string[] = new Array(partCount);
  const partLoaded = new Array<number>(partCount).fill(0);
  const workers: Worker[] = [];
  let nextPartIndex = 0;

  try {
    await Promise.all(
      Array.from({ length: Math.min(workerCount, partCount) }, () => {
        const worker = new Worker(new URL('./fileHashPart.worker.ts', import.meta.url), {
          type: 'module',
        });
        workers.push(worker);

        return new Promise<void>((resolve, reject) => {
          const runNext = () => {
            if (nextPartIndex >= partCount) {
              resolve();
              return;
            }

            const partIndex = nextPartIndex;
            nextPartIndex += 1;
            const start = partIndex * PART_SIZE;
            const end = Math.min(start + PART_SIZE, file.size);
            worker.postMessage({ taskId, partIndex, file, start, end });
          };

          worker.onmessage = (event: MessageEvent<HashPartResponse>) => {
            const data = event.data;
            if (data.taskId !== taskId) {
              return;
            }

            if (typeof data.loaded === 'number') {
              partLoaded[data.partIndex] = data.loaded;
              self.postMessage({
                taskId,
                loaded: partLoaded.reduce((sum, value) => sum + value, 0),
                total: file.size,
              } satisfies HashWorkerResponse);
              return;
            }

            if (data.error) {
              reject(new Error(data.error));
              return;
            }

            partHashes[data.partIndex] = data.hash || '';
            runNext();
          };

          worker.onerror = () => reject(new Error('哈希计算失败'));
          runNext();
        });
      })
    );

    const blake3 = await createBLAKE3();
    const encoder = new TextEncoder();
    blake3.init();
    blake3.update(encoder.encode(`${TREE_HASH_VERSION}:${file.size}:${PART_SIZE}:${partCount}:`));
    partHashes.forEach((hash, partIndex) => {
      const start = partIndex * PART_SIZE;
      const end = Math.min(start + PART_SIZE, file.size);
      blake3.update(encoder.encode(`${partIndex}:${start}:${end}:${hash};`));
    });
    return blake3.digest();
  } finally {
    workers.forEach((worker) => worker.terminate());
  }
};

self.onmessage = async (event: MessageEvent<HashWorkerRequest>) => {
  const { taskId, file } = event.data;

  try {
    const hash = await hashTree(taskId, file);
    self.postMessage({ taskId, hash } satisfies HashWorkerResponse);
  } catch (error) {
    self.postMessage({
      taskId,
      error: error instanceof Error ? error.message : '哈希计算失败',
    } satisfies HashWorkerResponse);
  }
};

export {};
