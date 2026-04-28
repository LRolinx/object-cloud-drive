const USER_STORAGE_KEY = 'object-cloud-user';

export type UserState = {
  isLogin: boolean;
  id: string;
  photo: string;
  nickname: string;
};

const emptyUserState: UserState = {
  isLogin: false,
  id: '',
  photo: '',
  nickname: '',
};

const readUserState = (): UserState => {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) {
    return emptyUserState;
  }

  try {
    return { ...emptyUserState, ...JSON.parse(raw) };
  } catch {
    return emptyUserState;
  }
};

let state = readUserState();

export const getUserState = () => state;

export const setUserState = (nextState: Partial<UserState>) => {
  state = { ...state, ...nextState };
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(state));
};

export const clearUserState = () => {
  state = { ...emptyUserState };
  localStorage.removeItem(USER_STORAGE_KEY);
};
