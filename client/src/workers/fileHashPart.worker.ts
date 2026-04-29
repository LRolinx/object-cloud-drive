import { createBLAKE3 } from 'hash-wasm';

const CHUNK_SIZE = 64 * 1024 * 1024;

type HashPartRequest = {
  taskId: string;
  partIndex: number;
  file: File;
  start: number;
  end: number;
};

type HashPartResponse = {
  taskId: string;
  partIndex: number;
  hash?: string;
  loaded?: number;
  error?: string;
};

const readChunk = (file: File, start: number, end: number) => file.slice(start, end).arrayBuffer();

self.onmessage = async (event: MessageEvent<HashPartRequest>) => {
  const { taskId, partIndex, file, start: rangeStart, end: rangeEnd } = event.data;

  try {
    const blake3 = await createBLAKE3();
    blake3.init();

    let start = rangeStart;
    let nextEnd = Math.min(start + CHUNK_SIZE, rangeEnd);
    let nextRead = readChunk(file, start, nextEnd);

    while (start < rangeEnd) {
      const end = nextEnd;
      const buffer = await nextRead;
      start = end;
      nextEnd = Math.min(start + CHUNK_SIZE, rangeEnd);
      nextRead = start < rangeEnd ? readChunk(file, start, nextEnd) : Promise.resolve(new ArrayBuffer(0));

      blake3.update(new Uint8Array(buffer));
      self.postMessage({
        taskId,
        partIndex,
        loaded: start - rangeStart,
      } satisfies HashPartResponse);
    }

    self.postMessage({
      taskId,
      partIndex,
      hash: blake3.digest(),
    } satisfies HashPartResponse);
  } catch (error) {
    self.postMessage({
      taskId,
      partIndex,
      error: error instanceof Error ? error.message : '哈希计算失败',
    } satisfies HashPartResponse);
  }
};

export {};
