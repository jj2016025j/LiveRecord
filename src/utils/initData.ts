import { TradingOptions } from '@/store';
import type { MemberOptions } from '@/api';
import { TradeStatusNum, TradeTypeNum, VerifyStatusNum } from './enums';
import dayjs from 'dayjs';
import { myFactory } from './myFactory';

interface IInitProps {
  isTest?: boolean;
}
// 用於簡易判斷每個init的內部小工具
const handleIsTest = (props?: IInitProps) => {
  const { isTest } = props || {};
  return process.env.NODE_ENV === 'development' && isTest;
};

const initTradeStore = (props?: IInitProps): Array<TradingOptions> => {
  if (handleIsTest(props))
    return [
      {
        blockChainConfirm: false,
        createdAt: dayjs().format(),
        cryptoAmount: 100,
        cryptoType: 'ERC20_USDT',
        customerId: '5fd9c850-c0e4-423c-9820-2ebaf13e5f46',
        customerName: '王曉明',
        customerQrCode: '123456789',
        customerWallet: '0xA1De32737e4A71FA72d3692e969035Cc606F8a85',
        fee: 0,
        fiatAmount: 3357,
        quotePrice: 3356.491511,
        rate: 33.56491511,
        sysWallet: '0x79e4B6B373AA1e3cC476Cc8514aC633aa36a9d2b',
        transactionId: '0ba94607-ebcf-48de-a2dd-713be6af4667',
        transactionStatus: TradeStatusNum.PaidToGuest,
        transactionType: TradeTypeNum.CustomerSell,
        updatedAt: '2024-04-24T11:28:28.1724054Z',
      },
    ];
  return [];
};

const initLoginForm = (props?: IInitProps) => {
  if (handleIsTest(props))
    return {
      userName: 'store',
      password: '123456aA',
    };

  return {};
};

const memberListInit = (props?: IInitProps) => {
  if (handleIsTest(props)) {
    const members: Array<MemberOptions> = Array(10)
      .fill(null)
      .map(() => {
        const makeMember: MemberOptions = {
          userId: myFactory.string.uuid(),
          userName: myFactory.person.fullName(),
          roles: ['Customer'],
          kycVerifyStatus: VerifyStatusNum.Verifing,
        };
        return makeMember;
      });
    return members;
  }
  return [];
};

export { initLoginForm, initTradeStore, memberListInit };
