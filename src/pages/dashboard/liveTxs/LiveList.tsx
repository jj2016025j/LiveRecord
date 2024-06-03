import { DollarOutlined } from '@ant-design/icons';
import { List, Row, Skeleton, Space, Tag } from 'antd';
import { TradeStatusNum, TradeTypeNum, tTon } from '../../../utils';
import { useTradeStore } from '../../../store';
import TxDes from './TxDes';
import ErrorBanner from '@/components/ErrorBanner';
import dayjs from 'dayjs';
import { usePendingTxs } from '@/api';
import { useState } from 'react';

interface ILiveListProps { }

const LiveList: React.FunctionComponent<ILiveListProps> = (props) => {
  // DOM
  const { } = props || {};
  const { isPending } = usePendingTxs({});
  const { transactions, connectionStatus } = useTradeStore();
  const [signedIDs, setSignedIDs] = useState<Array<string>>([]);

  const showTx = transactions.filter((tx) => !([TradeStatusNum.Cancelled, TradeStatusNum.Completed] as Array<TradeStatusNum>).includes(tx.transactionStatus))

  if (connectionStatus === 'connected') {
    return (
      <>
        <List
          itemLayout='horizontal'
          dataSource={showTx}
          renderItem={(t) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Row
                    justify='space-between'
                    align='middle'
                  >
                    <div
                      style={{
                        color: t.transactionType === TradeTypeNum.CustomerBuy ? 'blue' : 'red',
                        fontSize: 20,
                      }}
                    >
                      客人
                      {`${t.transactionType === TradeTypeNum.CustomerBuy ? '購買' : '出售'} ${t.cryptoType}`}
                    </div>

                    {/* 標籤表 */}
                    <Space>
                      <Tag
                        style={{ margin: 0 }}
                        bordered={false}
                      >
                        {'台中(fake)'}
                      </Tag>
                      <Tag
                        style={{ margin: 0 }}
                        bordered={false}
                      >
                        {'台中(fake) 逢甲(fake) 02(fake)'}
                      </Tag>
                      <Tag
                        style={{ margin: 0 }}
                        bordered={false}
                      >
                        {'CsName(fake)'}
                      </Tag>
                      <Tag
                        style={{ margin: 0 }}
                        bordered={false}
                        icon={<DollarOutlined style={{ color: '#FDA200' }} />}
                      >
                        {'現金(fake)'}交易
                      </Tag>
                    </Space>
                  </Row>
                }
                description={
                  <TxDes
                    {...{ setSignedIDs, signedIDs }}
                    items={{
                      sysWallet: t.sysWallet,
                      isBxConfirmed: t.blockChainConfirm,
                      rate: t.rate,
                      cryptoType: t.cryptoType,
                      amount: tTon(t.cryptoAmount),
                      customerName: t.customerName,
                      customerIdNumber: 'fake',
                      transactionType: t.transactionType,
                      customerWallet: t.customerWallet,
                      createdAt: t.createdAt ? dayjs(t.createdAt).format('YYYY.MM.DD HH:mm') : '--:--:--',
                      hash: t.hash ? t.hash : '',
                      fee: tTon(t.fee),
                      price: tTon(t.quotePrice),
                      totalPrice: tTon(t.fee) + tTon(t.quotePrice),
                      transactionId: t.transactionId,
                      transactionStatus: t.transactionStatus,
                    }}
                  />
                }
              />
            </List.Item>
          )}
        />
      </>
    );
  }

  if (connectionStatus === 'connecting' || isPending) {
    return (
      <List
        itemLayout='horizontal'
        dataSource={[1, 2, 3]}
        renderItem={() => (
          <List.Item>
            <Skeleton />
          </List.Item>
        )}
      />
    );
  }

  if (connectionStatus === 'disconnected' || connectionStatus === 'failed') {
    return (
      <List
        itemLayout='horizontal'
        dataSource={[1]}
        renderItem={() => {
          return (
            <ErrorBanner
              message='交易資訊已斷線'
              block
            />
          );
        }}
      />
    );
  }

  return (
    <List
      itemLayout='horizontal'
      dataSource={[]}
    />
  );
};

export default LiveList;
