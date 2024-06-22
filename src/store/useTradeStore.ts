import { create } from 'zustand';
import { CryptoTypes, TradeStatusNum, TradeTypeNum } from '../utils';
import { initTradeStore } from '../utils/initData';
import dayjs from 'dayjs';

type CreatePayTypes = 'bank' | 'cash';

type TradingOptions = {
  blockChainConfirm: boolean;
  createdAt: string;
  cryptoAmount: number;
  cryptoType: CryptoTypes;
  customerId: string;
  customerName: string;
  customerQrCode: string;
  customerWallet: string;
  fee: number;
  hash: string;
  fiatAmount: number;
  quotePrice: number;
  rate: number;
  sysWallet: string;
  transactionId: string;
  transactionStatus: TradeStatusNum;
  transactionType: TradeTypeNum;
  updatedAt: string;
};

type ConnectionStatus = 'connecting' | 'failed' | 'connected' | 'disconnected';

interface ITradeStore {
  connectionStatus: ConnectionStatus;
  setConnectionStatus: (connectionStatus: ConnectionStatus) => void;
  transactions: Array<TradingOptions>;
  setTransactions: (transactions: Array<TradingOptions>) => void;
  addTransactions: (transactions: Array<TradingOptions>) => void;
  removeTransactions: (transactionsID: Array<string>) => void;
  updateTransaction: (transaction: TradingOptions) => void;
}

const isTest = false;
const useTradeStore = create<ITradeStore>((set) => ({
  connectionStatus: 'disconnected',
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
  transactions: initTradeStore({ isTest }),
  setTransactions: (newTxs) => {
    const transactions = initTradeStore({ isTest })
      .concat(newTxs)
      .filter(() => true)
      .sort((a, b) => {
        if (dayjs(b.createdAt).isAfter(a.createdAt)) return 1;
        if (dayjs(b.createdAt).isSame(a.createdAt)) return 0;
        return -1;
      });

    set({ transactions });
  },
  addTransactions: (newTransactions) => {
    set((state) => {
      const allData = newTransactions.concat(state.transactions);
      const transactionsID = allData.map((data) => data.transactionId);
      const setIDs = Array.from(new Set(transactionsID));
      const transactions = setIDs
        .reduce((pre, id) => {
          const transaction = allData.find((data) => data.transactionId === id);
          if (!transaction) return pre;
          return [...pre, transaction];
        }, [] as Array<TradingOptions>)
        .sort((a, b) => {
          // 由大到小
          if (dayjs(b.createdAt).isSame(a.createdAt)) return 0;
          if (dayjs(b.createdAt).isAfter(a.createdAt)) return 1;
          return -1;
        });
      return {
        ...state,
        transactions,
      };
    });
  },
  removeTransactions: (thisIDs) => {
    set((state) => {
      const transactions = state.transactions.filter((screenData) => {
        return !thisIDs.includes(screenData.transactionId);
      });
      return {
        ...state,
        transactions,
      };
    });
  },
  updateTransaction: (transaction) => {
    set((states) => {
      const transactions = states.transactions.slice();
      const originIndex = transactions.findIndex(
        (screenData) => screenData.transactionId === transaction.transactionId,
      );
      transactions.splice(originIndex, 1, transaction);

      return { ...states, transactions };
    });
  },
}));

export { useTradeStore };
export type { CreatePayTypes, TradingOptions };
