type HashProgress = {
  loaded: number;
  total: number;
};

export const hashFileInWorker = (
  taskId: string,
  file: File,
  onProgress?: (progress: HashProgress) => void,
  signal?: AbortSignal
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('任务已取消', 'AbortError'));
      return;
    }

    const worker = new Worker(new URL('../workers/fileHash.worker.ts', import.meta.url), {
      type: 'module',
    });
    const cleanupAbort = () => signal?.removeEventListener('abort', abort);
    const abort = () => {
      worker.terminate();
      cleanupAbort();
      reject(new DOMException('任务已取消', 'AbortError'));
    };
    signal?.addEventListener('abort', abort, { once: true });

    worker.onmessage = (event: MessageEvent<{ taskId: string; hash?: string; loaded?: number; total?: number; error?: string }>) => {
      const data = event.data;
      if (data.taskId !== taskId) {
        return;
      }

      if (typeof data.loaded === 'number' && typeof data.total === 'number') {
        onProgress?.({ loaded: data.loaded, total: data.total });
        return;
      }

      if (data.error) {
        worker.terminate();
        cleanupAbort();
        reject(new Error(data.error));
        return;
      }

      worker.terminate();
      cleanupAbort();
      resolve(data.hash ?? '');
    };

    worker.onerror = () => {
      worker.terminate();
      cleanupAbort();
      reject(new Error('哈希计算失败'));
    };

    worker.postMessage({ taskId, file });
  });
};
