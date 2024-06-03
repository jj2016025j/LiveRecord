import LOGO from '@/assets/APEC_logo_lightUse_橫.png';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { CreatePayTypes, useUserStore } from '@/store';
import { Button, Modal, QRCode, Row, Skeleton } from 'antd';
import { CryptoTypes, nTot, TradeTypeNum } from '@/utils';
import ErrorBanner from '@/components/ErrorBanner';
import { Verification } from '../Verification';
import styles from './styles.module.scss';
import { CreateSellRes } from '@/api';

export type ContractOptions = {
  createdAt: string;
  transactionId: string;
  staff: string;
  transactionType: TradeTypeNum;
  customerName: string;
  cryptoType: CryptoTypes;
  amount: number;
  totalPrice: number;
  rate: number;
  hash: string | null;
  customerID: string;
  customerPhone: string;
  storePhone: string;
  customerIDNumber: string;
  walletAddress: string;
  payType: CreatePayTypes;

  bankName: string | null; // 銀行資訊僅在轉帳交易時才會有，沒有時不用特別標示
  account: string | null;
  customerAccount: string | null; // 客人的銀行戶名就是客人的名字 (customerName)
  customerBankName: string | null;
};

interface AddBankModalprops {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onFinish?: () => void; // 列印成功時
  contractInfo: ContractOptions | undefined;
  sellData?: CreateSellRes | undefined;
  isLoading?: boolean;
  resetSellData?: any;
}

const SignatureContract: React.FunctionComponent<AddBankModalprops> = (props) => {
  const a4Ref = useRef(null);
  // DOM
  const { open, setOpen, contractInfo, sellData, onFinish, isLoading, resetSellData } = props || {};
  const { systemWallet } = sellData || { systemWallet: '' };
  const { walletAddress } = contractInfo || { walletAddress: '' };
  const [verifyCode, setVerifyCode] = useState(false); // 列印前需要先完成CS驗證碼
  const [readyToPrint, setReadyToPrint] = useState(false);
  const { currency } = useUserStore();
  const showWalletAddress = readyToPrint ? systemWallet : walletAddress
  const showQRCode = readyToPrint ? !!systemWallet : !!walletAddress

  // handlers
  const handlePrint = useReactToPrint({
    content: () => a4Ref.current,
    pageStyle: 'fontFamily: DFKai-sb',
    onAfterPrint: () => {
      setOpen(false);
      setReadyToPrint(false)
      resetSellData()
    }
  });
  useEffect(() => {
    console.log('============START============')
    console.log('systemWallet', systemWallet)
    console.log('walletAddress', walletAddress)
    console.log('showWalletAddress', showWalletAddress)
    console.log('showQRCode', showQRCode)
    console.log('readyToPrint', readyToPrint)
    console.log('systemWallet', systemWallet != '')
    console.log('systemWallet', systemWallet != undefined)
    console.log('=============END==============')
    if (!!systemWallet && readyToPrint) {
      console.log('進行列印')
      setTimeout(handlePrint, 0)
      // handlePrint();
      return
    }
    console.log('還沒列印')
  }, [systemWallet, contractInfo])


  if (!isLoading && contractInfo) {
    const { transactionType, customerID, createdAt, transactionId, staff, account, walletAddress } = contractInfo || {};
    const { customerIDNumber, storePhone, bankName, customerPhone, totalPrice, rate, hash } = contractInfo || {};
    const { customerName, cryptoType, amount, customerAccount, payType, customerBankName } = contractInfo || {};

    return (
      <>
        <Modal
          closable={false}
          open={open}
          onCancel={() => {
            setOpen(false);
          }}
          footer={
            <Button
              loading={isLoading || !contractInfo}
              onClick={() => setVerifyCode(true)}
              type='primary'
            >
              列印
            </Button>
          }
          width='fit-content'
        >
          <div
            className={styles['box-A4']}
            ref={a4Ref}
          >
            <div style={{ textAlign: 'center', fontSize: 30 }}>交易合約書</div>
            <Row
              justify='space-between'
              style={{ fontFamily: 'DFKai-sb' }}
            >
              <div>日期: {createdAt} </div>
              <div>合約書編號： {transactionId}</div>
              <div>辦理人員: {staff} </div>
            </Row>
            <div>
              <div>
                賣方：
                <span>
                  {transactionType === TradeTypeNum.CustomerBuy
                    ? '亞太加密資產交易中心 台灣 台中逢甲門市(Fake)'
                    : customerName}
                </span>
                (以下簡稱甲方)
              </div>
              <div>
                買方：
                <span>
                  {transactionType === TradeTypeNum.CustomerBuy
                    ? customerName
                    : '亞太加密資產交易中心 台灣 台中逢甲門市(Fake)'}
                </span>
                (以下簡稱乙方)
              </div>
              <div>甲、乙雙方同意以下條款進行商品交易，以此憑證。</div>
            </div>
            <div>
              <div>合約準則及法規責任：</div>
              <ol>
                <li>甲、乙雙方必須以實名/其本人之銀行戶口交易，不可以委託他人代辦或第三方戶口進行交易。</li>
                <li>當乙方將所需商品之合約金額以一次匯給甲方，而甲方在指定時間內將商品轉至乙方，此交易當告完成。</li>
                <li>
                  乙方需保證其匯出之資金均屬於乙方個人財產且不涉及任何詐騙、洗錢等活動。如甲方因收到乙方資金而導致被銀行方管控封鎖或司法機關提訊，乙方需承擔一切之法律責任及甲方之經濟損失。
                </li>
              </ol>
            </div>

            {/* 交易明細 */}
            <table width={500}>
              <thead>
                <tr>
                  <th align='left'>交易明細</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>商品名稱：</td>
                  <td>{cryptoType} </td>
                </tr>
                <tr>
                  <td>商品數量：</td>
                  <td>
                    {nTot({
                      value: amount,
                      digitsType: cryptoType,
                    })}
                  </td>
                </tr>
                <tr>
                  <td>交易金額：</td>
                  <td>{nTot({ value: totalPrice, digitsType: currency })}</td>
                </tr>
                <tr>
                  <td>商品匯率：</td>
                  <td>{nTot({ value: rate, digitsType: cryptoType })}</td>
                </tr>
                <tr>
                  <td>訂單發起時間：</td>
                  <td>{createdAt}</td>
                </tr>
                {/* <tr>
                  <td>完成交易時間：</td>
                  <td>完成交易時間</td>
                </tr> */}
                <tr>
                  <td>訂單號：</td>
                  <td>{hash ?? '--'} </td>
                </tr>
              </tbody>
            </table>

            {/* 甲乙方 */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* 甲方出售不必顯示錢包地址 */}
              <table style={{ height: 'fit-content', minWidth: 250 }}>
                <thead>
                  <tr>
                    <th align='left'>甲方</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>姓名：</td>
                    <td>
                      {transactionType === TradeTypeNum.CustomerBuy
                        ? '亞太加密資產交易中心 台灣 台中逢甲門市(Fake)'
                        : customerName}
                    </td>
                  </tr>

                  {transactionType === TradeTypeNum.CustomerSell && (
                    <tr>
                      <td>會員編號：</td>
                      <td>{customerID}</td>
                    </tr>
                  )}

                  <tr>
                    <td>電話：</td>
                    <td>{transactionType === TradeTypeNum.CustomerBuy ? storePhone : customerPhone}</td>
                  </tr>

                  {transactionType === TradeTypeNum.CustomerSell && (
                    <tr>
                      <td>身分證：</td>
                      <td>{customerID}</td>
                    </tr>
                  )}

                  {payType === 'bank' && (
                    <>
                      <tr>
                        <td>銀行名稱</td>
                        <td>{transactionType === TradeTypeNum.CustomerBuy ? bankName : customerBankName}</td>
                      </tr>
                      <tr>
                        <td>銀行帳號</td>
                        <td>{transactionType === TradeTypeNum.CustomerBuy ? account : customerAccount}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>

              {/* 乙方顯示買方資訊 */}
              <table>
                <thead>
                  <tr>
                    <th
                      style={{ textAlign: 'left' }}
                      colSpan={2}
                    >
                      乙方
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>姓名：</td>
                    <td>
                      {transactionType === TradeTypeNum.CustomerSell
                        ? '亞太加密資產交易中心 台灣 台中逢甲門市(Fake)'
                        : customerName}
                    </td>
                  </tr>

                  {transactionType === TradeTypeNum.CustomerBuy && (
                    <tr>
                      <td>會員編號：</td>
                      <td>{customerID}</td>
                    </tr>
                  )}

                  <tr>
                    <td>電話：</td>
                    <td>{transactionType === TradeTypeNum.CustomerSell ? storePhone : customerPhone}</td>
                  </tr>

                  {transactionType === TradeTypeNum.CustomerBuy && (
                    <tr>
                      <td>身分證：</td>
                      <td>{customerIDNumber}</td>
                    </tr>
                  )}

                  {payType === 'bank' && (
                    <>
                      <tr>
                        <td>銀行名稱</td>
                        <td>{transactionType === TradeTypeNum.CustomerBuy ? customerBankName : bankName}</td>
                      </tr>
                      <tr>
                        <td>銀行帳號</td>
                        <td>{transactionType === TradeTypeNum.CustomerBuy ? customerAccount : account}</td>
                      </tr>
                    </>
                  )}

                  <tr>
                    <td
                      colSpan={2}
                      valign='top'
                    >
                      錢包地址：
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={2}
                      style={{ paddingLeft: '1cm' }}
                    >
                      <span style={{ marginBottom: 5 }}>{showWalletAddress}</span>
                      {showQRCode ? (
                        <QRCode
                          style={{ width: 250, height: 250 }}
                          value={showWalletAddress}
                        />
                      ) : (
                        <Skeleton.Input active />
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles['box-water_mark']}>
              <img
                src={LOGO}
                style={{ width: '15cm', opacity: '30%' }}
                alt='APEC'
              />
            </div>
          </div>
        </Modal>

        <Verification
          open={verifyCode}
          onCancel={() => setVerifyCode(false)}
          onOk={() => {
            setVerifyCode(false);
            if (onFinish) onFinish();
            setReadyToPrint(true)
          }}
        />
      </>
    );
  }

  if (isLoading) {
    return (
      <Modal
        width={'24cm'}
        centered
        footer
        closable={false}
        {...{ open }}
      >
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Modal>
    );
  }

  return (
    <Modal
      width={'24cm'}
      centered
      footer
      closable={false}
      {...{ open }}
    >
      <ErrorBanner block />
    </Modal>
  );
};

export default SignatureContract;
