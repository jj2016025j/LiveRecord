import dayjs from 'dayjs';
import { useState } from 'react';
import CancelButton from '../../../components/CancelButton';
import VerifyButton from '../../../components/VerifyButton';
import { CryptoTypes, myFactory, nTot, TradeStatusNum, TradeTypeNum } from '@/utils';
import { Row, Tag, Space, Checkbox, Button, Typography } from 'antd';
import { useCancel, useCustomerPayCash, useStoreComplete, useStorePay } from '@/api';
import { useTradeStore, useUserStore } from '../../../store';
import TxStep from './TxStep';
import SignatureContract, { ContractOptions } from '@/components/SignatureContract';

export type TxDesOptions = {
  cryptoType: CryptoTypes;
  amount: number;
  customerName: string;
  customerIdNumber: string;
  transactionType: TradeTypeNum;
  customerWallet: string;
  createdAt: string;
  hash: string;
  fee: number;
  price: number;
  totalPrice: number;
  transactionId: string;
  transactionStatus: TradeStatusNum;
  rate: number;
  isBxConfirmed: boolean;
  sysWallet: null | string;
};
interface ITxDesProps {
  items: TxDesOptions;
  signedIDs: Array<string>;
  setSignedIDs: React.Dispatch<React.SetStateAction<Array<string>>>;
}

const { Title } = Typography;
const TxDes: React.FunctionComponent<ITxDesProps> = (props) => {
  // DOM
  const { items, signedIDs, setSignedIDs } = props || {};
  const {
    cryptoType, amount, customerIdNumber, customerName, customerWallet, totalPrice, sysWallet,
    transactionId, transactionStatus, transactionType, createdAt, fee, price, hash, rate, isBxConfirmed
  } = items || {};
  const [openContract, setOpenContract] = useState(false);

  const contractInfo: ContractOptions = items && {
    createdAt,
    transactionId,
    staff: 'Staff(fake)',
    transactionType,
    customerName,
    cryptoType,
    amount,
    totalPrice: amount + fee,
    rate,
    hash,
    customerID: 'ID (fake)',
    customerPhone: myFactory.phone.number() + '(fake)',
    storePhone: myFactory.phone.number() + '(fake)',
    customerIDNumber: '',

    walletAddress: transactionType === TradeTypeNum.CustomerBuy ? customerWallet : (sysWallet as string), // 當出售時sysWallet就不會為null
    payType: 'cash',
    bankName: null,
    account: null,
    customerAccount: null,
    customerBankName: null,
  };
  const { currency } = useUserStore();
  const { removeTransactions } = useTradeStore();
  // mutation
  const { mutate: cancel, isPending: canceling } = useCancel({ isTest: false });
  const { mutate: customerPay, isPending: payingCash } = useCustomerPayCash({
    isTest: false,
  });
  const { mutate: sellPay, isPending: salesInPayment } = useStorePay({});
  const { mutate: complete, isPending: onComplete } = useStoreComplete({ isTest: false });
  const publicChainLoading = onComplete || !isBxConfirmed

  return (
    <>
      <Row justify='space-between'>
        {/* 左側交易資訊 */}
        <table>
          <tbody>
            <tr>
              <td>交易數量：</td>
              <td>{nTot({ value: amount, digitsType: cryptoType })}</td>
            </tr>
            <tr>
              <td>匯率：</td>
              <td>{nTot({ value: rate, digitsType: cryptoType })}</td>
            </tr>
            <tr>
              <td>客人姓名(會員編號):</td>
              <td>{`${customerName} (${customerIdNumber})`}</td>
            </tr>

            {transactionType === TradeTypeNum.CustomerBuy && (
              <tr>
                <td>客人錢包地址：</td>
                <td>{customerWallet}</td>
              </tr>
            )}

            <tr>
              <td>訂單發起時間：</td>
              <td>{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</td>
            </tr>

            {transactionType === TradeTypeNum.CustomerSell && (
              <tr>
                <td>hash:</td>
                <td>{hash}</td>
              </tr>
            )}
            {transactionType === TradeTypeNum.CustomerSell && (
              <tr>
                <td>狀態</td>

                <td>
                  <Tag color='orange'>待確認</Tag>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/*  */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'end',
            textAlign: 'end',
          }}
        >
          <div>
            <div>
              交易金額：
              {nTot({
                value: price,
                digitsType: currency,
              })}
              {currency}
            </div>
            <div>
              交易手續費：
              {nTot({ value: fee, digitsType: currency })}
            </div>

            {/* 總共 */}
            <Title style={{ margin: 0, fontWeight: 'bold' }}>
              <span>{transactionType === TradeTypeNum.CustomerBuy ? '收款' : '付款'}</span>
              <span style={{ fontSize: 14, margin: 5 }}>{currency}</span>
              <span>
                {nTot({
                  value: totalPrice,
                  digitsType: currency,
                })}
              </span>
            </Title>
          </div>
        </div>
      </Row>

      {/* 底部 */}
      <Row
        justify='space-between'
        style={{ marginTop: 10 }}
      >
        <Space
          size='large'
          style={{ alignItems: 'center' }}
        >
          {/* 步驟 */}
          <TxStep
            {...{
              payType: 'cash',
              transactionStatus,
              transactionType,
              isSigned: signedIDs.includes(transactionId),
              isBxConfirmed,
            }}
          />
          {/* 取消交易 */}
          {((![TradeStatusNum.Completed, TradeStatusNum.Cancelled].includes(transactionStatus) &&
            transactionType === TradeTypeNum.CustomerBuy) ||
            ([TradeStatusNum.AdminChecking].includes(transactionStatus) &&
              transactionType === TradeTypeNum.CustomerSell)) && (
              <CancelButton
                style={{ transform: 'translate( 0, 5px )' }}
                loading={canceling}
                onOk={() => {
                  cancel({ transactionUid: transactionId });
                }}
              />
            )}
        </Space>

        <Space>
          <Checkbox
            checked={signedIDs.includes(transactionId)}
            onChange={(e) => {
              if (e.target.checked) {
                setSignedIDs((pre) => {
                  pre.push(transactionId);
                  return [...pre];
                });
              } else {
                setSignedIDs((pre) => {
                  const originIndex = pre.findIndex((data) => data === transactionId);
                  pre.splice(originIndex, 1);
                  return [...pre];
                });
              }
            }}
            disabled={
              canceling ||
              // 購買
              (![TradeStatusNum.Signing, TradeStatusNum.Receiving].includes(transactionStatus) &&
                transactionType === TradeTypeNum.CustomerBuy) ||
              // 出售
              (isBxConfirmed && transactionType === TradeTypeNum.CustomerSell)
            }
          >
            客人已在
            <Button
              style={{ padding: 0 }}
              type='link'
              onClick={() => setOpenContract(true)}
            >
              交易合約書
            </Button>
            簽名
          </Checkbox>

          {/* 購買: 客人付款 */}
          {[TradeStatusNum.Signing, TradeStatusNum.Receiving].includes(transactionStatus) &&
            transactionType === TradeTypeNum.CustomerBuy && (
              <VerifyButton
                onOk={() => {
                  customerPay({ transactionId });
                }}
                type='primary'
                loading={canceling || payingCash || salesInPayment}
                disabled={!signedIDs.includes(transactionId)}
              >
                客人已付款
              </VerifyButton>
            )}

          {/* 購買: 等待後臺審核 */}
          {transactionStatus === TradeStatusNum.UnderReview && transactionType === TradeTypeNum.CustomerBuy && (
            <Button
              disabled
              loading
            >
              審核中
            </Button>
          )}

          {/* 購買: 告知後臺已確認轉帳資訊 */}
          {transactionStatus === TradeStatusNum.BuyerCheck && transactionType === TradeTypeNum.CustomerBuy && (
            <>
              {publicChainLoading && (
                <VerifyButton
                  onOk={() => { }}
                  needHash={true}
                >
                  手動確認交易完成
                </VerifyButton>
              )}
              <VerifyButton
                onOk={() => { complete({ transactionId }); }}
                type='primary'
                loading={publicChainLoading}
                disabled={publicChainLoading}
              >
                交易完成
              </VerifyButton>
            </>
          )}

          {/* 出售: 等待工鏈通過轉帳 */}
          {transactionStatus === TradeStatusNum.AdminChecking &&
            !isBxConfirmed &&
            transactionType === TradeTypeNum.CustomerSell && (
              <>
                <Button
                  loading={signedIDs.includes(transactionId)}
                  disabled={!signedIDs.includes(transactionId)}
                >
                  {!signedIDs.includes(transactionId) ? '完成簽名' : '等待轉帳中'}{' '}
                </Button>
                {
                  signedIDs.includes(transactionId) &&
                  <VerifyButton
                    onOk={() => { }}
                    needHash={true}
                  >
                    手動確認交易完成
                  </VerifyButton>
                }
              </>
            )
          }

          {/* 出售: 等待後台審核 */}
          {transactionStatus === TradeStatusNum.AdminChecking &&
            isBxConfirmed &&
            transactionType === TradeTypeNum.CustomerSell && (
              <Button
                loading={signedIDs.includes(transactionId)}
                disabled={!signedIDs.includes(transactionId)}
              >
                {!signedIDs.includes(transactionId) ? '完成簽名' : '審核中'}{' '}
              </Button>
            )}

          {/* 出售: 後台已審核 -> 付款給客人 */}
          {transactionStatus === TradeStatusNum.AdminChecked && transactionType === TradeTypeNum.CustomerSell && (
            <VerifyButton
              type='primary'
              onOk={() => sellPay({ transactionId })}
              loading={salesInPayment}
            >
              付款
            </VerifyButton>
          )}

          {/* 出售: 告知後臺已確認轉帳資訊 */}
          {transactionStatus === TradeStatusNum.PaidToGuest && transactionType === TradeTypeNum.CustomerSell && (
            <VerifyButton
              onOk={() => {
                complete({ transactionId });
              }}
              type='primary'
              loading={onComplete}
            >
              交易完成
            </VerifyButton>
          )}

          {/* 已完成的交易點選不顯示在進行中 */}
          {[TradeStatusNum.Cancelled, TradeStatusNum.Completed].includes(transactionStatus) && (
            <Button
              onClick={() => {
                removeTransactions([transactionId]);
              }}
              type='link'
            >
              了解
            </Button>
          )}
        </Space>
      </Row >


      <SignatureContract
        {...{
          open: openContract,
          setOpen: setOpenContract,
          contractInfo,
          isLoading: undefined,
        }}
      />
    </>
  );
};

export default TxDes;
