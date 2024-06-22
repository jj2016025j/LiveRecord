import { useState } from 'react';
import { axiosRoot } from '@/utils/axiosRoot';
import {
  useTestQuery,
  UseTestQueryProps,
  UseTestMutationProps,
  useTestMutation,
  CryptoTypes,
  myFactory,
} from '@/utils';
import { ShiftInfoOptions } from '@/pages/shift/components/ShiftReport';
import dayjs, { Dayjs } from 'dayjs';
import { CryptoCurrent } from '.';

// === types ===
// #. current
type ShiftCurrentRes = {
  id: number;
  lastShiftCashAmount: number;
  startTime: string;
  endTime: string | null;
  currentCashAmount: number;
  totalTransFiat: number;
  addFiat: number;
  removeFiat: number;
  shiftCryptoSummary: [
    {
      cryptoCurrency: 'ERC20_USDT';
      totalBought: 100;
      totalSold: 0;
      totalFiatBought: 3360;
      totalFiatSold: 0;
    },
  ];
};
type ShiftCurrentProps = {};
type ShiftOther = {};
// #. create
type ShiftCreateRes = ShiftCurrentRes;
type ShiftCreateProps = {};
type ShiftCreateOther = {};
// #. close
type ShiftCloseRes = ShiftCurrentRes;
type ShiftCloseProps = {};
type ShiftCloseOther = {
  setOpenClose: React.Dispatch<React.SetStateAction<boolean>>;
};
// #. hookProps
type UseSummaryProps = {
  current: UseTestQueryProps<ShiftOther, ShiftCurrentRes>;
  create: UseTestMutationProps<ShiftCreateRes, ShiftCreateProps, ShiftCreateOther>;
  close: UseTestMutationProps<ShiftCloseRes, ShiftCloseProps, ShiftCloseOther>;
};
// === methods ==
const handleMakeInfo = (data: ShiftCurrentRes): ShiftInfoOptions => {
  const { lastShiftCashAmount, startTime, currentCashAmount, totalTransFiat } = data;
  const { addFiat, removeFiat, shiftCryptoSummary } = data;
  const cryptoSummary = shiftCryptoSummary.at(0);
  const makeInfo: ShiftInfoOptions = {
    cryptos: cryptoSummary
      ? (['BTC', 'ERC20_USDT', 'ETH', 'TRC20_USDT', 'TRX'] as Array<CryptoTypes>).map((crypto) => {
          const makeCrypoInfo: CryptoCurrent = {
            crypto,
            buy: {
              numOfOrders: myFactory.number.int(10),
              amount: cryptoSummary.totalBought,
              counterAccount: cryptoSummary.totalFiatBought,
            },
            sell: {
              numOfOrders: myFactory.number.int(10),
              amount: cryptoSummary.totalSold,
              counterAccount: cryptoSummary.totalFiatSold,
            },
            subTotal: {
              numOfOrders: myFactory.number.int(20),
              amount: cryptoSummary.totalSold + cryptoSummary.totalBought,
              counterAccount: cryptoSummary.totalFiatBought + cryptoSummary.totalFiatSold,
            },
          };
          return makeCrypoInfo;
        })
      : [],
    location: myFactory.location.city() + '(fake)',
    counterNum: myFactory.number.int(20),
    counterStaff: myFactory.person.fullName() + '(fake)',
    lastShiftBalance: lastShiftCashAmount,
    transactionAmount: totalTransFiat,
    counterTopup: addFiat,
    counterTakeout: removeFiat,
    currentAccount: currentCashAmount,
    fromDate: startTime,
  };
  return makeInfo;
};
// === Hook ===
const useSummaryShift = (hookProps: UseSummaryProps) => {
  const { current, create, close } = hookProps;
  const [shiftInfo, setShiftInfo] = useState<ShiftInfoOptions>();
  const [updateDate, setUpdateDate] = useState<Dayjs>();

  // #. current
  const { ...currentConfig } = current;
  const useCurrent = () => {
    return useTestQuery<ShiftCurrentRes, ShiftCurrentProps>({
      ...currentConfig,
      queryKey: ['shift', 'current'],
      qf: () => {
        const request = axiosRoot.get<ShiftCurrentRes>('/store/shiftSummary').then(({ data }) => {
          setShiftInfo(() => handleMakeInfo(data));
          return data;
        });

        return request;
      },
      onSuccess: () => {
        setUpdateDate(dayjs());
      },
    });
  };

  // #. create
  const { ...createConfig } = create;
  const useCreate = () => {
    return useTestMutation<ShiftCreateRes, ShiftCreateProps>({
      ...createConfig,
      mutationFn: () => {
        const request = axiosRoot.post<ShiftCreateRes>('/store/openShift').then(({ data }) => {
          setShiftInfo(() => handleMakeInfo(data));
          return data;
        });
        return request;
      },
    });
  };

  // #. close
  const { setOpenClose, ...closeConfig } = close;
  const useClose = () => {
    const { reset, ...mutation } = useTestMutation<ShiftCloseRes, ShiftCloseProps>({
      ...closeConfig,
      mutationFn: () => {
        const request = axiosRoot.post<ShiftCloseRes>('/store/closeShift').then(({ data }) => {
          setShiftInfo(() => handleMakeInfo(data));
          return data;
        });
        return request;
      },
      onSuccess: () => {
        setOpenClose(false);
      },
    });
    const manutlReset = () => {
      reset();
      setShiftInfo(undefined);
    };
    return { ...mutation, reset: manutlReset };
  };

  return {
    useClose,
    useCreate,
    useCurrent,
    shiftInfo,
    setShiftInfo,
    updateDate,
    setUpdateDate,
  };
};

export { useSummaryShift };
export type {
  ShiftCurrentRes,
  ShiftCurrentProps,
  ShiftCreateRes,
  ShiftCreateProps,
  ShiftCloseRes,
  ShiftCloseProps,
  UseSummaryProps,
};
