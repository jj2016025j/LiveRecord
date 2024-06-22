import localforage from 'localforage';

const forageKeys = {
  loginProps: 'loginProps',
  auth: 'auth',
  ratesQueryTime: 'ratesQueryTime',
};

const forage = () => localforage;

export { forageKeys, forage };
