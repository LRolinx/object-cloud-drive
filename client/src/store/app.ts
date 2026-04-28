const PUBLIC_KEY_STORAGE_KEY = 'object-cloud-public-key';

type AppState = {
  publickey: string;
};

const state: AppState = {
  publickey: localStorage.getItem(PUBLIC_KEY_STORAGE_KEY) ?? '',
};

export const setPublickey = (value: string) => {
  state.publickey = value;
  localStorage.setItem(PUBLIC_KEY_STORAGE_KEY, value);
};

export const getPublickey = () => state.publickey;
