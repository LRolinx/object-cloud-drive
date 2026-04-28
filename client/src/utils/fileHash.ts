export const hashFileInWorker = (taskId: string, file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../workers/fileHash.worker.ts', import.meta.url), {
      type: 'module',
    });

    worker.onmessage = (event: MessageEvent<{ taskId: string; hash?: string; error?: string }>) => {
      const data = event.data;
      if (data.taskId !== taskId) {
        return;
      }
      worker.terminate();

      if (data.error) {
        reject(new Error(data.error));
        return;
      }

      resolve(data.hash ?? '');
    };

    worker.onerror = () => {
      worker.terminate();
      reject(new Error('哈希计算失败'));
    };

    worker.postMessage({ taskId, file });
  });
};
