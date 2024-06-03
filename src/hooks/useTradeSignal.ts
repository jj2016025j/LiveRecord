import { useLogout } from '@/api';
import { useEffect, useRef } from 'react';
import { TradingOptions, useTradeStore, useUserStore } from '../store';
import { HttpError, HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

const url =
  process.env.NODE_ENV === 'development'
    ? '/hubs/store' // proxy:  => http://192.168.10.122:5555/hubs/store
    : 'http://192.168.10.122:5555/hubs/store';

type SignalProps = {
  onCreated?: (message: TradingOptions) => void;
  onCxPay?: (message: TradingOptions) => void;
  onTransed?: (message: TradingOptions) => void;
  onBxConfirm?: (message: TradingOptions) => void;
  onTxCompleted?: (message: TradingOptions) => void;
  onTxCancel?: (message: TradingOptions) => void;
};
const useTradeSignal = (props: SignalProps) => {
  const hubConnection = useRef<HubConnection>();
  // DOM
  const { onCreated, onCxPay, onTransed, onBxConfirm, onTxCompleted, onTxCancel } = props || {};
  const { auth } = useUserStore();
  const { setConnectionStatus, connectionStatus, addTransactions, updateTransaction, removeTransactions } =
    useTradeStore();

  // mutate
  const { logout } = useLogout();

  // === Set events ===
  useEffect(() => {
    const connection = hubConnection.current;
    if (connectionStatus !== 'connected' || !connection) return;
    // 建立訂單
    connection.on('TransactionCreated', (message) => {
      console.info('TransactionCreated: ', message);
      if (onCreated) onCreated(message);
      addTransactions([message]);
    });

    // 客人已經付錢
    connection.on('TransactionPaymentMade', (message: TradingOptions) => {
      console.info('TransactionPaymentMade: ', message);
      if (onCxPay) onCxPay(message);
      updateTransaction(message);
    });

    // 已經付錢給客人
    connection.on('TransactionTransferred', (message: TradingOptions) => {
      console.info('TransactionTransferred: ', message);
      if (onTransed) onTransed(message);
      updateTransaction(message);
    });

    // 區塊練已經確認
    connection.on('BlockchainConfirm', (message: TradingOptions) => {
      console.info('BlockchainConfirm: ', message);
      if (onBxConfirm) onBxConfirm(message);
      updateTransaction(message);
    });

    // 交易完成
    connection.on('TransactionCompleted', (message: TradingOptions) => {
      console.info('TransactionCompleted: ', message);
      if (onTxCompleted) onTxCompleted(message);
      removeTransactions([message.transactionId]);
    });

    // 交易取消
    connection.on('TransactionCancel', (message: TradingOptions) => {
      console.info('TransactionCancel: ', message);
      if (onTxCancel) onTxCancel(message);
      removeTransactions([message.transactionId]);
    });

    // 出金異常
    connection.on('UnexpectedDeposit', (message) => {
      console.info('UnexpectedDeposit: ', message);
    });

    //  KYC提交
    connection.on('/KycNotify', (message) => {
      console.info('KycNotify', message);
    });
  }, [connectionStatus]);

  // === Build Connection ===
  useEffect(() => {
    const { Connected, Connecting, Disconnected } = HubConnectionState;
    const { state } = hubConnection.current || {};
    if (state !== undefined && [Disconnected].includes(state)) {
      if (!hubConnection.current) return;
      const connection = hubConnection.current;
      connection
        .start()
        .then(() => {
          console.info('Hub connection restarted !!!');
          setConnectionStatus('connected');
        })
        .catch((e: HttpError) => {
          console.warn('Hub connection on error, error:', e);
          if (e.message.includes('401')) {
            logout();
          }
          setConnectionStatus('failed');
        });
      return;
    }

    if (!auth || (state !== undefined && [Connected, Connecting].includes(state))) return;
    // #: Reconnect

    // #: Build
    hubConnection.current = new HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: () => auth.token,
      })
      .build();
    const connection = hubConnection.current;

    // #: Start
    setConnectionStatus('connecting');
    connection
      .start()
      .then(() => {
        console.info('Hub connection started !!!');
        setConnectionStatus('connected');
      })
      .catch((e: HttpError) => {
        console.warn('Hub connection on error, error:', e);
        if (e.message.includes('401')) {
          logout();
        }

        setConnectionStatus('failed');
      });

    // #: Close
    connection.onclose = (e) => {
      console.info('Hub onClose!! , event:', e);
      setConnectionStatus('disconnected');
    };

    // #: Return
    return () => {
      if ([Connected].includes(connection.state)) {
        connection
          .stop()
          .then(() => console.warn('Connection disconnected!'))
          .catch((e) => console.warn('Hub stop error!!, error:', e));
      }
    };
  }, [auth]);

  return {
    status,
  };
};

export { useTradeSignal };
