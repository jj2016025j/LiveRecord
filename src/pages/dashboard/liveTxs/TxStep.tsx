import { Steps } from 'antd';
import { CreatePayTypes } from '../../../store';
import { TradeStatusNum, TradeTypeNum } from '../../../utils';

interface ITxStepProps {
  payType: CreatePayTypes;
  transactionStatus: TradeStatusNum;
  transactionType: TradeTypeNum;
  isSigned: boolean;
  isBxConfirmed: boolean;
}

const TxStep: React.FunctionComponent<ITxStepProps> = (props) => {
  const { transactionStatus, transactionType, payType, isSigned, isBxConfirmed } = props || {};
  const useCurrent = () => {
    // === 購買 ===
    if (transactionType === TradeTypeNum.CustomerBuy) {
      if ((!isSigned && transactionStatus === TradeStatusNum.Receiving) || transactionStatus === TradeStatusNum.Signing)
        return 0;
      if (transactionStatus === TradeStatusNum.Receiving) return 1;
      if (transactionStatus === TradeStatusNum.BuyerCheck) {
        if (isBxConfirmed) return 4;
        return 3;
      }
      if (transactionStatus === TradeStatusNum.Completed) return 5;
    }
    // === 出售 ===
    if (
      (transactionStatus === TradeStatusNum.Signing && !isBxConfirmed ) ||
      (!isSigned && transactionStatus === TradeStatusNum.AdminChecking && !isBxConfirmed)
    ) {
      return 0;
    }
    if (!isBxConfirmed && transactionStatus === TradeStatusNum.AdminChecking) return 1;
    if (isBxConfirmed && transactionStatus === TradeStatusNum.AdminChecking) return 3;
    if (transactionStatus === TradeStatusNum.AdminChecking) return 2;
    if (transactionStatus === TradeStatusNum.AdminChecked) return 3;
    if (transactionStatus === TradeStatusNum.PaidToGuest) return 4;
    if (transactionStatus === TradeStatusNum.Completed) return 5;
    return 0;
  };
  const useItems = () => {
    if (transactionStatus === TradeStatusNum.Cancelled) return [{ title: '交易已取消' }];
    // === 客人購買 ===
    if (transactionType === TradeTypeNum.CustomerBuy) {
      // === 現金 ===
      if (payType === 'cash') {
        return [
          {
            title: '簽名',
            description: '任何交易前，先確保客人已在交易合約書上簽名，勾選”客人已在交易合約書簽名”才可進行後續動作',
          },
          {
            title: '收款',
            description: '請向客人收取應收金額，收取後，點擊’客人已付款’',
          },
          {
            title: '審核',
            description: '等候後台審核',
          },
          {
            title: '轉帳中',
            description: '等待工鏈確認',
          },
          {
            title: '確認',
            description: '現場確認轉帳資訊',
          },
          {
            title: '完成',
            description: '收據交給客人',
          },
        ];
      }
      // === 銀行 ===
      if (payType === 'bank') {
        return [
          {
            title: '簽名',
            description: '任何交易前，先確保客人已在交易合約書上簽名，勾選”客人已在交易合約書簽名”才可進行後續動作',
          },
          {
            title: '收款',
            description: '請向客人收取應收金額，收取後，點擊’客人已付款’',
          },
          {
            title: '審核',
            description: '等候後台審核',
          },
          {
            title: '轉帳中',
            description: '等待工鏈確認',
          },
          {
            title: '確認',
            description: '現場確認轉帳資訊',
          },
          {
            title: '完成',
            description: '收據交給客人',
          },
        ];
      }
    }

    /// === 客人出售 ===
    if (transactionType === TradeTypeNum.CustomerSell) {
      // === 現金 ===
      if (payType === 'cash') {
        return [
          {
            title: '簽名',
            description: '任何交易前，先確保客人已在交易合約書上簽名，勾選”客人已在交易合約書簽名”才可進行後續動作',
          },
          {
            title: '轉帳',
            description: '協助客人轉帳至對應錢包',
          },
          {
            title: '審核中',
            description: '等候後台審核轉帳資訊',
          },
          {
            title: '付款',
            description: '後臺已確認收到款項，支付金額給客人',
          },
          {
            title: '付款完畢',
            description: '告知後台已完成交易',
          },
          {
            title: '完成',
            description: '收據交給客人',
          },
        ];
      }
      // === 銀行 ===
      if (payType === 'bank') {
        return [
          {
            title: '簽名',
            description: '任何交易前，先確保客人已在交易合約書上簽名，勾選”客人已在交易合約書簽名”才可進行後續動作',
          },
          {
            title: '收款',
            description: '請向客人收取應收金額，收取後，點擊’客人已付款’',
          },
          {
            title: '審核',
            description: '等候後台審核',
          },
          {
            title: '轉帳中',
            description: '等待工鏈確認',
          },
          {
            title: '確認',
            description: '現場確認轉帳資訊',
          },
          {
            title: '完成',
            description: '收據交給客人',
          },
        ];
      }
    }
    // === 預設 ===
    return [
      {
        title: '載入中',
        description: '交易狀態載入失敗',
      },
      {},
      {},
    ];
  };

  const current = useCurrent();
  const items = useItems();
  return (
    <>
      <Steps {...{ current, type: 'inline', items }} />
    </>
  );
};

export default TxStep;
