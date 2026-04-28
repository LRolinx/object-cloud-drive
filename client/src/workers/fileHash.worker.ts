self.onmessage = async (event: MessageEvent<{ taskId: string; file: File }>) => {
  const { taskId, file } = event.data;

  try {
    const buffer = await file.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    const hash = Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');

    self.postMessage({ taskId, hash });
  } catch (error) {
    self.postMessage({
      taskId,
      error: error instanceof Error ? error.message : '哈希计算失败',
    });
  }
};

export {};
