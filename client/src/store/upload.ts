import { useSyncExternalStore } from 'react';

import { BatchAddUserFileType } from '@/types/BatchAddUserFileType';

type UploadStoreState = {
  tasks: BatchAddUserFileType[];
};

let state: UploadStoreState = {
  tasks: [],
};

const listeners = new Set<() => void>();

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
  state = {
    tasks: [...state.tasks, ...tasks],
  };
  emitChange();
};

export const updateUploadTask = (
  taskId: string,
  patch: Partial<BatchAddUserFileType> | ((task: BatchAddUserFileType) => BatchAddUserFileType)
) => {
  state = {
    tasks: state.tasks.map((task) => {
      if (task.taskId !== taskId) {
        return task;
      }
      return typeof patch === 'function' ? patch(task) : { ...task, ...patch };
    }),
  };
  emitChange();
};

export const removeUploadTask = (taskId: string) => {
  state = {
    tasks: state.tasks.filter((task) => task.taskId !== taskId),
  };
  emitChange();
};

export const clearFinishedUploadTasks = () => {
  state = {
    tasks: state.tasks.filter((task) => task.progress !== 100 && !task.errorMessage),
  };
  emitChange();
};
