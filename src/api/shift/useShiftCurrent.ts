import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { CryptoTypes, myFactory, useTestQuery, UseTestQueryProps } from '../../utils';
import { axiosRoot } from '../../utils/axiosRoot';

// types
type CryptoCurrent = {
  crypto: CryptoTypes;
  buy: {
    numOfOrders: number;
    amount: number;
    counterAccount: number;
  };
  sell: {
    numOfOrders: number;
    amount: number;
    counterAccount: number;
  };
  subTotal: {
    numOfOrders: number;
    amount: number;
    counterAccount: number;
  };
};

type ShiftCurrentRes = {
  fromDate: string;
  cryptos: Array<CryptoCurrent>;
  location: string;
  counterNum: number;
  counterStaff: string;
  lastShiftBalance: number;
  transactionAmount: number;
  counterTopup: number;
  counterTakeout: number;
  currentAccount: number;
};

type ShiftCurrentProps = {};
type OtherProps = {
  counterID: string;
};

const useShiftCurrent = (useProps: UseTestQueryProps<OtherProps, ShiftCurrentProps>) => {
  const { counterID, ...config } = useProps;
  const [updateDate, setUpdateDate] = useState<Dayjs>();

  const testQuery = useTestQuery<ShiftCurrentRes, ShiftCurrentProps>({
    ...config,
    queryKey: ['shift', 'current', counterID],
    qf: () => {
      const request = axiosRoot.get('/shift/last').then(({ data }) => data);

      return request;
    },
    onQuery() {
      setUpdateDate(undefined);
    },
    onSuccess: () => {
      setUpdateDate(dayjs());
    },
    delay: 0,
    onTest: () => {
      const cryptosTypes: Array<CryptoTypes> = ['BTC', 'ERC20_USDT', 'ETH', 'TRC20_USDT', 'TRX'];
      const cryptos = cryptosTypes.map((currency) => {
        const buyAmount = myFactory.number.float({ min: 100, max: 10000 });
        const sellAmount = myFactory.number.float({ min: -10000, max: -100 });
        const makeData: CryptoCurrent = {
          crypto: currency,
          buy: {
            numOfOrders: myFactory.number.int(20),
            amount: buyAmount,
            counterAccount: Math.round(buyAmount / 30.15),
          },
          sell: {
            numOfOrders: myFactory.number.int(20),
            amount: sellAmount,
            counterAccount: Math.round(sellAmount / 30.15),
          },
          subTotal: {
            numOfOrders: myFactory.number.int(20),
            amount: buyAmount + sellAmount,
            counterAccount: Math.round((buyAmount + sellAmount) / 30.15),
          },
        };
        return makeData;
      });
      const lastShiftBalance = myFactory.number.int({ min: 10000, max: 30000 });
      const transactionAmount = cryptos.reduce((pre, current) => {
        return pre + current.subTotal.amount;
      }, 0);
      const counterTopup = myFactory.number.int(5000);
      const counterTakeout = myFactory.number.int({ max: 0, min: -5000 });
      const makeData: ShiftCurrentRes = {
        fromDate: dayjs()
          .subtract(1, 'day')
          .set('hour', 16)
          .set('minute', 0)
          .set('second', 0)
          .format('YYYY-MM-DD HH:mm:ss'),
        cryptos,
        location: '台中逢甲',
        counterNum: myFactory.number.int({ min: 1, max: 10 }),
        counterStaff: myFactory.person.firstName(),
        lastShiftBalance,
        transactionAmount,
        counterTopup,
        counterTakeout,
        currentAccount: lastShiftBalance + transactionAmount + counterTopup + counterTakeout,
      };

      return Promise.resolve(makeData);
    },
  });

  return { updateDate, ...testQuery };
};

export { useShiftCurrent };
export type { CryptoCurrent, ShiftCurrentRes, ShiftCurrentProps };
