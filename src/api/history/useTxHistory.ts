import dayjs from 'dayjs';
import { CreatePayTypes } from '../../store';
import {
  CryptoTypes,
  CurrencyTypes,
  myFactory,
  TradeTypeNum,
  useTestMutation,
  UseTestMutationProps,
} from '../../utils';
import { axiosRoot } from '../../utils/axiosRoot';


type TxRecord = {
  id: string;
  country: string;
  store: string;
  createAt: string;
  completeAt: string;
  orderNum: string;
  serialNum: string;
  memberName: string;
  memberNum: string;
  counter: string;
  txtype: TradeTypeNum;
  crypto: CryptoTypes;
  amount: number;
  currency: CurrencyTypes;
  price: number;
  exRate: number;
  payMethod: CreatePayTypes;
  fee: number;
  memberAddress: string;
  hash: string;
  operator: string;
};
type TxRecordFromSx = Omit<TxRecord, 'id'> & { transactionID: string; }
type HistoryRes = {
  history: Array<TxRecord>;
  toID?: string;
};
type HistoryResFromSx ={
  history: Array<TxRecordFromSx>;
  toID?: string;
}

type HistoryProps = {
  dateFrom: string;
  dateTo: string;
  pageSize?: number;
  toID?: string;
};

type OtherProps = {};

const useTxHistory = (
  { ...useProps }: UseTestMutationProps<HistoryRes, HistoryProps, OtherProps>,
) => {
  const testMutation = useTestMutation<HistoryRes, HistoryProps>({
    ...useProps,
    mutationFn: (props) => {
      const request = axiosRoot.get<HistoryResFromSx>('/trade/history', { params: props })
      .then(({ data }) => {
      const history: Array<TxRecord> = data.history.map((record) =>{
        const makeRecord: TxRecord ={
          ...record,
          id: record.transactionID
        }
        return makeRecord;
      });

        const historyRes: HistoryRes = {
          ...data,
          history,
        }
        return historyRes
      });
      return request;
    },
    delay: 1000,
    onTest: (props) => {
      const history = Array(100)
        .fill(null)
        .map(() => {
          const record: TxRecord = {
            id: myFactory.string.uuid(),
            country: myFactory.location.country(),
            store: '台中逢甲',
            createAt: dayjs(myFactory.date.past({ years: 1 })).format(),
            completeAt: dayjs(myFactory.date.between({ from: props.dateFrom, to: props.dateTo })).format(),
            orderNum: myFactory.string.sample(),
            serialNum: myFactory.string.sample(),
            memberName: myFactory.person.firstName(),
            memberNum: myFactory.string.uuid().slice(-8),
            counter: myFactory.number.int(12).toString().padStart(2, '0'),
            txtype:
              ([TradeTypeNum.CustomerBuy, TradeTypeNum.CustomerSell] as Array<TradeTypeNum>).at(
                myFactory.number.int(1),
              ) ?? TradeTypeNum.CustomerBuy,
            crypto:
              (['BTC', 'ERC20_USDT', 'ETH', 'TRC20_USDT', 'TRX'] as Array<CryptoTypes>).at(myFactory.number.int(10)) ??
              'BTC',
            amount: myFactory.number.int({ min: 100, max: 10000 }),
            price: myFactory.number.float({ min: 3000, max: 10000 }),
            currency: 'TWD',
            exRate: 31.5,
            payMethod: (['bank', 'cash'] as Array<CreatePayTypes>).at(myFactory.number.int(1)) ?? 'bank',
            fee: myFactory.number.float(30),
            memberAddress:
              ((['BTC', 'ERC20_USDT', 'ETH', 'TRC20_USDT', 'TRX'] as Array<CryptoTypes>).at(myFactory.number.int(10)) ??
                'BTC') + myFactory.string.uuid().slice(-12),
            hash: myFactory.string.uuid().slice(-12),
            operator: myFactory.person.firstName(),
          };

          return record;
        });
      const makeData: HistoryRes = {
        history,
        toID: [undefined, myFactory.string.uuid()].at(myFactory.number.int(1)),
      };

      return Promise.resolve(makeData);
    },
  });

  return { ...testMutation };
};

export { useTxHistory };
export type { TxRecord, HistoryRes, HistoryProps };
