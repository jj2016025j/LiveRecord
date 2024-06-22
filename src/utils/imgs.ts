import eth from '../assets/eth.png';
import usdt from '../assets/usdt.png';
import trx from '../assets/trx.png';
import btc from '../assets/btc.png';
import sol from '../assets/sol.png';
import tw from '@/assets/flag.jpg';
import { CryptoTypes } from './options';

const flags = {
  tw,
};

const cryptoImgs = {
  eth,
  usdt,
  trx,
  btc,
  sol,
};

const getCryptoImgs = (type: CryptoTypes) => {
  if (type === 'BTC') return btc;
  if (type === 'ERC20_USDT') return usdt;
  if (type === 'ETH') return eth;
  if (type === 'TRC20_USDT') return usdt;
  return sol;
};

export { cryptoImgs, getCryptoImgs, flags };
