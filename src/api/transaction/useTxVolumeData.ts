import { UseTestQueryProps, useTestQuery } from '@/utils';
import { axiosRoot } from '@/utils/axiosRoot';
import { cryptoImgs } from '@/utils';

const showTxVolumeData: Array<TxVolumeData> = [
  {
    title: 'USDT交易額',
    crypto: 'USDT',
    icon: cryptoImgs.usdt,
    txNum: 18,
    txQuantity: '20,482.00',
    txAmount: '150,850',
    currency: 'TWD',
    fee: 150,
  },
  {
    title: 'ETH交易額',
    crypto: 'ETH',
    icon: cryptoImgs.eth,
    txNum: 9,
    txQuantity: '20,482.00',
    txAmount: '150,850',
    currency: 'TWD',
    fee: 150,
  },
  {
    title: 'BTC交易額',
    crypto: 'BTC',
    icon: cryptoImgs.btc,
    txNum: 3,
    txQuantity: '20,482.00',
    txAmount: '150,850',
    currency: 'TWD',
    fee: 150,
  },
  {
    title: 'TRX交易額',
    crypto: 'TRX',
    icon: cryptoImgs.trx,
    txNum: 7,
    txQuantity: '20,482.00',
    txAmount: '150,850',
    currency: 'TWD',
    fee: 150,
  },
  {
    title: 'SOL交易額',
    crypto: 'SOL',
    icon: cryptoImgs.sol,
    txNum: 1,
    txQuantity: '20,482.00',
    txAmount: '150,850',
    currency: 'TWD',
    fee: 150,
  },
];

const txReports: Array<TxReport> = [
  { crypto: 'USDT', txQuantity: 20482.00, txAmount: 150850, fee: 150 },
  { crypto: 'BTC', txQuantity: 5200.00, txAmount: 300000, fee: 300 },
  { crypto: 'ETH', txQuantity: 10482.00, txAmount: 250000, fee: 250 },
  { crypto: 'TRX', txQuantity: 150000.00, txAmount: 90000, fee: 90 },
  { crypto: 'SOL', txQuantity: 3482.00, txAmount: 60850, fee: 60 },
  { crypto: 'USDT', txQuantity: 50000.00, txAmount: 85000, fee: 85 },
  { crypto: 'TRX', txQuantity: 75000.00, txAmount: 55000, fee: 55 },
  { crypto: 'USDT', txQuantity: 18500.00, txAmount: 88000, fee: 88 },
  { crypto: 'BTC', txQuantity: 9482.00, txAmount: 140850, fee: 140 },
  { crypto: 'BTC', txQuantity: 4800.00, txAmount: 120000, fee: 120 },
  { crypto: 'USDT', txQuantity: 6482.00, txAmount: 200850, fee: 200 }];

function countTxreport(reports: Array<TxReport>) {
  const aggregatedData = reports.reduce<CryptoIndex>((acc, report) => {
    const { crypto, txQuantity, txAmount, fee } = report;
    if (!acc[crypto]) {
      acc[crypto] = {
        crypto,
        txNum: 0,
        txQuantity: 0,
        txAmount: 0,
        fee: 0
      };
    }
    acc[crypto].txQuantity += txQuantity
    acc[crypto].txAmount += txAmount
    acc[crypto].fee += fee;
    acc[crypto].txNum += 1;
    return acc;
  }, {});

  return Object.values(aggregatedData).map(data => ({
    crypto: data.crypto,
    txQuantity: data.txQuantity,
    txAmount: data.txAmount,
    fee: data.fee,
    txNum: data.txNum,
  }));
}

const updateShowData
  = (
    showData: Array<TxVolumeData>,
    CountTxData: Array<CountTxreport>
  ) => {
    return showData.map(item => {
      const found = CountTxData.find(v => v.crypto === item.crypto);
      if (found) {
        return {
          ...item,
          txNum: found.txNum,
          txQuantity: found.txQuantity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          txAmount: found.txAmount.toLocaleString('en-US'),
          fee: found.fee
        };
      }
      return item;
    });
  }

type TxReport = {
  crypto: string;
  txQuantity: number;
  txAmount: number;
  fee: number;
};

type CountTxreport = {
  crypto: string;
  txNum: number,
  txQuantity: number;
  txAmount: number;
  fee: number;
}

type CryptoIndex = {
  [crypto: string]: CountTxreport
};

type TxVolumeData = {
  title: string,
  crypto: string,
  icon: string,
  txNum: number,
  txQuantity: string,
  txAmount: string,
  currency: string,
  fee: number,
}

type TxReportsRes = Array<TxVolumeData>

type TxReportsProps = {}
type OtherProps = {};

const useTxVolumeData = (useProps: UseTestQueryProps<OtherProps, TxReportsRes>) => {
  const { ...other } = useProps;

  const testQuery = useTestQuery<TxReportsRes, TxReportsProps>({
    ...other,
    queryKey: ['pending'],
    qf: () => {
      const request = axiosRoot.get('/取得交易紀錄的API').then(({ data }) => data);
      return request;
    },
    onSuccess: () => {
      const txVolumeData = countTxreport(txReports);
      // console.log('txVolumeData', txVolumeData);
      const updatedShowTxVolumeData = updateShowData(showTxVolumeData, txVolumeData);
      // console.log('updatedShowTxVolumeData', updatedShowTxVolumeData);
      return Promise.resolve(updatedShowTxVolumeData);
    },
    onTest: () => {
      const txVolumeData = countTxreport(txReports);
      // console.log('txVolumeData', txVolumeData);
      const updatedShowTxVolumeData = updateShowData(showTxVolumeData, txVolumeData);
      // console.log('updatedShowTxVolumeData', updatedShowTxVolumeData);
      return Promise.resolve(updatedShowTxVolumeData);
    }
  });

  return { ...testQuery };
};

export { useTxVolumeData };
// export type { TxVolumeData };

// 调用更新函数
