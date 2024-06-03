import { QueryMemberProps } from "@/api";
import dayjs, { Dayjs } from 'dayjs';
import { CreateChannelProps, QueryMemberRes } from '../../api';
import { CreatePayTypes, useUserStore } from '../../store';

import { CryptoTypes, myFactory, TradeAmountRange, TradeTypeNum, tTon } from '../../utils';
import { ContractOptions } from '@/components/SignatureContract';

type SubmitChannelProps = {
  name: string;
  cryptoType: CryptoTypes;
  amountLevel: TradeAmountRange;
  date: Dayjs;
  time: { hours: number; minutes: number };
};

const useHandleChannel = ({
  createChannel,
  id,
}: {
  createChannel: (props: CreateChannelProps) => void;
  id: string | undefined;
}) => {
  const handleSubmitChannel = (props: SubmitChannelProps) => {
    if (!id) return;
    const newProps: CreateChannelProps = {
      id,
      cryptoType: props.cryptoType,
      amountLevel: props.amountLevel,
      date: dayjs(props.date).set('hour', props.time.hours).set('minute', props.time.minutes).format(),
    };

    createChannel(newProps);
  };

  return {
    handleSubmitChannel,
  };
};

/**
 * # 建立訂單步驟:
 * 1. 暫存訂單資訊
 * 2. 將表單資訊傳換為合約內容 當有訂單資訊時顯示合約內容
 * 3. Store 核對合約內容無誤發送驗證碼
 * 4. 驗證碼無誤將暫存的訂單資訊轉換成API格式發送，並且列印合約內容
 * 5. 發送完畢後關閉所有談窗
 */

// === 客人購買 ===
type SubmitBuyProps = {
  setContractInfo: React.Dispatch<React.SetStateAction<ContractOptions | undefined>>;
  memberInfo: QueryMemberRes | undefined;
  cryptoType: CryptoTypes;
  payType: CreatePayTypes;
};
type BuyFormSubmit = {
  address: string;
  amount: string;
  customerId: string;
  customerName: string;
  price: string;
  rate: string;
  handling: string; // 自動填入目前的交易手續費
};
const useSubmitBuy = ({ cryptoType, setContractInfo, memberInfo, payType }: SubmitBuyProps) => {
  const { auth } = useUserStore();

  const handleSubmitBuy = (values: BuyFormSubmit) => {
    if (!auth || !memberInfo) return;

    const makeData: ContractOptions = {
      createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
      transactionId: '',
      staff: auth.userName,
      transactionType: TradeTypeNum.CustomerBuy,
      customerName: values.customerName,
      cryptoType,
      amount: tTon(values.amount),
      totalPrice: tTon(values.price) + tTon(values.handling),
      rate: tTon(values.rate),
      hash: null,
      customerID: values.customerId,
      customerPhone: myFactory.phone.number() + '(fake)',
      storePhone: myFactory.phone.number() + '(fake)',
      bankName: 'bankName',
      customerIDNumber: 'customer ID Nubmer',
      account: 'account',
      walletAddress: values.address,
      payType,
      customerAccount: null,
      customerBankName: null,
    };
    setContractInfo(makeData);
  };
  return { handleSubmitBuy };
};

// === 客人出售 ===
type SubmitSellProps = {
  setContractInfo: React.Dispatch<React.SetStateAction<ContractOptions | undefined>>;
  memberInfo: QueryMemberRes | undefined;
  cryptoType: CryptoTypes;
  payType: CreatePayTypes;
};

type SellFormSubmit = {
  address: string;
  amount: string;
  customerId: string;
  customerName: string;
  price: string;
  rate: string;
  handling: string;
};

const useSubmitSell = ({ setContractInfo, memberInfo, cryptoType, payType }: SubmitSellProps) => {
  const { auth } = useUserStore();

  const handleSubmitSell = (values: SellFormSubmit) => {
    if (!auth || !memberInfo) return;
    const makeData: ContractOptions = {
      createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
      transactionId: '',
      staff: auth.userName,
      transactionType: TradeTypeNum.CustomerSell,
      customerName: values.customerName,
      cryptoType,
      amount: tTon(values.amount),
      totalPrice: tTon(values.price) + tTon(values.handling),
      rate: tTon(values.rate),
      hash: null,
      customerID: values.customerId,
      customerPhone: '',
      storePhone: '',
      bankName: '',
      customerIDNumber: '',
      account: '',
      walletAddress: '',
      payType,
      customerAccount: null,
      customerBankName: null,
    };
    setContractInfo(makeData);
  };
  return { handleSubmitSell };
};


type QuerySubmit = {
  customerId: string;
}

const useSubmitQuery = (query: (props: QueryMemberProps) => void) => {
  const handleSubmit = (values: QuerySubmit) => {
    const {customerId: userId } = values;
    const makeProps: QueryMemberProps = {
      userId,
    }
    query(makeProps)
  }
  return handleSubmit;
}
export { useSubmitQuery, useHandleChannel, useSubmitBuy, useSubmitSell  };
export type { QuerySubmit , SubmitBuyProps, BuyFormSubmit };