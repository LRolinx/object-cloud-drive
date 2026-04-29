import { useSyncExternalStore } from 'react';

import { BatchAddUserFileType } from '@/types/BatchAddUserFileType';

export enum DownloadTaskStatus {
  Waiting,
  Conduct,
  Success,
  Error,
}

export type DownloadTask = {
  taskId: string;
  fileName: string;
  fileSize: number;
  downloadedBytes: number;
  speedBytesPerSecond?: number;
  progress: number;
  status: DownloadTaskStatus;
  statusText?: string;
  errorMessage?: string;
};

type UploadStoreState = {
  tasks: BatchAddUserFileType[];
  downloadTasks: DownloadTask[];
};

let state: UploadStoreState = {
  tasks: [],
  downloadTasks: [],
};

const listeners = new Set<() => void>();
const uploadTaskCancelers = new Map<string, () => void>();
const canceledUploadTaskIds = new Set<string>();

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => state;

export const useUploadStore = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

export const addUploadTasks = (tasks: BatchAddUserFileType[]) => {
  tasks.forEach((task) => {
    if (task.taskId) {
      canceledUploadTaskIds.delete(task.taskId);
    }
  });

  state = {
    ...state,
    tasks: [...state.tasks, ...tasks],
  };
  emitChange();
};

export const updateUploadTask = (
  taskId: string,
  patch: Partial<BatchAddUserFileType> | ((task: BatchAddUserFileType) => BatchAddUserFileType)
) => {
  state = {
    ...state,
    tasks: state.tasks.map((task) => {
      if (task.taskId !== taskId) {
        return task;
      }
      return typeof patch === 'function' ? patch(task) : { ...task, ...patch };
    }),
  };
  emitChange();
};

export const registerUploadTaskCancel = (taskId: string, cancel: () => void) => {
  uploadTaskCancelers.set(taskId, cancel);

  return () => {
    if (uploadTaskCancelers.get(taskId) === cancel) {
      uploadTaskCancelers.delete(taskId);
    }
  };
};

export const isUploadTaskCanceled = (taskId?: string) => (taskId ? canceledUploadTaskIds.has(taskId) : false);

export const removeUploadTask = (taskId: string) => {
  canceledUploadTaskIds.add(taskId);
  uploadTaskCancelers.get(taskId)?.();
  uploadTaskCancelers.delete(taskId);

  state = {
    ...state,
    tasks: state.tasks.filter((task) => task.taskId !== taskId),
  };
  emitChange();
};

export const clearFinishedUploadTasks = () => {
  state = {
    ...state,
    tasks: state.tasks.filter((task) => task.progress !== 100 && !task.errorMessage),
    downloadTasks: state.downloadTasks.filter(
      (task) => task.status !== DownloadTaskStatus.Success && !task.errorMessage
    ),
  };
  emitChange();
};

export const addDownloadTask = (task: DownloadTask) => {
  state = {
    ...state,
    downloadTasks: [...state.downloadTasks, task],
  };
  emitChange();
};

export const updateDownloadTask = (
  taskId: string,
  patch: Partial<DownloadTask> | ((task: DownloadTask) => DownloadTask)
) => {
  state = {
    ...state,
    downloadTasks: state.downloadTasks.map((task) => {
      if (task.taskId !== taskId) {
        return task;
      }
      return typeof patch === 'function' ? patch(task) : { ...task, ...patch };
    }),
  };
  emitChange();
};

export const removeDownloadTask = (taskId: string) => {
  state = {
    ...state,
    downloadTasks: state.downloadTasks.filter((task) => task.taskId !== taskId),
  };
  emitChange();
};
