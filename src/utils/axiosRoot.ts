import axios from 'axios';
import { LoginRes } from '../api';
import { forage, forageKeys } from './foragePkg';

const axiosRoot = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? `${window.location.host}/api` : '/api',
});

axiosRoot.interceptors.request.use(async (config) => {
  const auth = await forage().getItem<LoginRes>(forageKeys.auth);
  if (!auth) return config;
  config.headers.Authorization = `Bearer ${auth.token}`;
  return config;
});

export { axiosRoot };
