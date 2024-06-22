import { create } from 'zustand';
import { LoginProps, LoginRes, RatesRes } from '../api';
import { StoreStatusOptions } from '../api/store';
import { CurrencyTypes } from '../utils';
import { forage, forageKeys } from '../utils/foragePkg';

type UserStoreInit = {
  auth: LoginRes | null;
  loginProps: LoginProps | null;
  rates: RatesRes | null;
  store: StoreStatusOptions | null;
  currency: null | CurrencyTypes;
};

type UserStoreOptions = UserStoreInit & {
  setAuth: (auth: LoginRes | null) => void;
  setLoginProps: (loginProps: LoginProps | null) => void;
  setRates: (rates: RatesRes | null) => void;
  setStoreStatus: (store: StoreStatusOptions | null) => void;
  reset: () => void;
};

const init: UserStoreInit = {
  currency: 'TWD',
  auth: null,
  loginProps: null,
  rates: null,
  store: null,
};
const useUserStore = create<UserStoreOptions>((set) => {
  return {
    ...init,
    setAuth: (auth) => {
      forage().setItem(forageKeys.auth, auth ,() => {
        set({ auth });
      });
    },
    setLoginProps: (loginProps) => {
      set({ loginProps });
      forage().setItem(forageKeys.loginProps, loginProps);
    },
    setRates: (rates) => {
      set({ rates });
    },
    setStoreStatus: (store) => {
      set({ store });
    },
    reset: () => set({ ...init }),
  };
});

export { useUserStore };
