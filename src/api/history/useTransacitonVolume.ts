import dayjs from 'dayjs';
import { CryptoTypes, myFactory, TradeTypeNum, useTestQuery, UseTestQueryProps } from '../../utils';
import { axiosRoot } from '../../utils/axiosRoot';

// type
type TransactionRecord = {
  id: string;
  type: TradeTypeNum;
  date: string;
  cryptoType: CryptoTypes;
  amount: number;
  price: number;
};
type VolumeRes = {
  history: Array<TransactionRecord>;
};

type VolumeProps = {};
type OtherProps = {};

const useTransactionVolume = (
  // prettier-ignore
  {...useProps}: UseTestQueryProps<VolumeRes, OtherProps>,
) => {
  const testQuery = useTestQuery<VolumeRes, VolumeProps>({
    ...useProps,
    queryKey: ['transaction', 'volume'],
    onTest: () => {
      const makeData: VolumeRes = {
        history: Array(100)
          .fill('')
          .map(() => {
            const cryptos: Array<CryptoTypes> = ['BTC', 'ERC20_USDT', 'ETH', 'TRC20_USDT', 'TRX'];
            const amount = myFactory.number.int({ min: 100, max: 5000 });
            const record: TransactionRecord = {
              id: myFactory.string.uuid(),
              type: myFactory.number.int(1) ? TradeTypeNum.CustomerBuy : TradeTypeNum.CustomerSell,
              date: dayjs().subtract(myFactory.number.int(7), 'day').format('YYYY-MM-DD HH:mm:ss'),
              cryptoType: cryptos.at(myFactory.number.int(cryptos.length)) ?? 'BTC',
              amount: myFactory.number.int({ min: 100, max: 5000 }),
              price: amount * 30.15,
            };
            return record;
          }),
      };

      return Promise.resolve(makeData);
    },
    qf: () => {
      const request = axiosRoot.get('/transaction/volume').then(({ data }) => data);

      return request;
    },
  });

  return { ...testQuery };
};

export { useTransactionVolume };
export type { TransactionRecord, VolumeRes, VolumeProps };
