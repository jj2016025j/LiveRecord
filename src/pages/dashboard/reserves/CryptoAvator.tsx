import { Avatar } from 'antd';
import * as React from 'react';
import { cryptoImgs, CryptoTypes } from '../../../utils';

interface ICryptoAvatorProps {
  type: CryptoTypes;
}

const CryptoAvator: React.FunctionComponent<ICryptoAvatorProps> = (
  // prettier-ignore
  { type },
) => {
  const useSrc = () => {
    if (type === 'BTC') return cryptoImgs.btc;
    if (type === 'ERC20_USDT') return cryptoImgs.usdt;
    if (type === 'TRC20_USDT') return cryptoImgs.usdt;
    if (type === 'TRX') return cryptoImgs.trx;
    if (type === 'ETH') return cryptoImgs.eth;
    return cryptoImgs.usdt;
  };
  return (
    <Avatar
      size='small'
      src={useSrc()}
    />
  );
};

export default CryptoAvator;
