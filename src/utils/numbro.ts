import numbro from 'numbro';
import { CryptoTypes } from './options';

type CurrencyTypes = 'TWD';

type NtoTprops = {
  value: unknown;
  digitsType?: CryptoTypes | CurrencyTypes | null;
};

const nTot = ({ value, digitsType }: NtoTprops): string => {
  // 避免 **.**.** 的格式
  if (!value || (typeof value === 'string' && value.split('.').length > 2)) return '0';
  if (typeof value === 'string' && /[^\d.,]/.test(value)) {
    const splitValue = value.split('');
    const firstDIndex = splitValue.findIndex((isD) => /[^\d.,]/.test(isD));
    const newValue = value.slice(0, firstDIndex);
    return newValue;
  }

  //
  const digits = () => {
    if (digitsType === 'BTC') return 2;
    if (digitsType === 'ERC20_USDT') return 2;
    if (digitsType === 'ETH') return 2;
    if (digitsType === 'TRC20_USDT') return 2;
    if (digitsType === 'TRX') return 2;
    if (digitsType === 'TWD') return 0;
    // 未設定的情況下回傳使用者輸入的結果
    if (typeof value === 'string' || typeof value === 'number') {
      const length = value.toString().split('.').at(1)?.length;
      if (length === undefined) return 0;
      if (length === 0) return -1;
      return length;
    }
    return 0;
  };

  if (digits() === -1) return value as string;

  return numbro(value).format({
    thousandSeparated: true,
    mantissa: digits(),
  });
};

const tTon = (value: unknown): number => {
  if (!value) return 0;
  if (typeof value === 'string') return numbro.unformat(value);
  if (typeof value === 'number') return value;
  return 0;
};

export { nTot, tTon };
export type { CurrencyTypes };
