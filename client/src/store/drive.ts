import { NavigationType } from '@/types/NavigationType';

type DriveState = {
  navigation: NavigationType[];
};

const state: DriveState = {
  navigation: [],
};

export const getDriveNavigation = () => state.navigation;

export const setDriveNavigation = (navigation: NavigationType[]) => {
  state.navigation = navigation;
};

export const resetDriveNavigation = () => {
  state.navigation = [];
};
