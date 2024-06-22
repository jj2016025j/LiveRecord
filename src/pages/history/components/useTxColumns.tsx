import { FileTextOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Space, TableProps, Tag, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import { TxRecord } from '@/api';
import { TradeTypeNum, getCryptoImgs, nTot, tTon } from '@/utils';

const { Text } = Typography;
const useTxColumns = () => {
  const columns: TableProps<TxRecord>['columns'] = [
    {
      title: '門市',
      dataIndex: 'store',
      align: 'center',
      key: 'store',
      filters: [
        {
          text: '台中逢甲',
          value: '台中逢甲',
        },
        {
          text: '台中老虎城',
          value: '台中老虎城',
        },
      ],
      width: 100,
    },
    {
      title: <div>日期</div>,
      dataIndex: 'createAt',
      key: 'orderCreationDate',
      render: (orderCreationDate, record) => (
        <div style={{ whiteSpace: 'none' }}>
          {`建立: ${orderCreationDate ? dayjs(orderCreationDate).format('YYYY-MM-DD HH:mm') : '-'}`}
          <br />
          {`完成: ${record.completeAt ? dayjs(record.completeAt).format('YYYY-MM-DD HH:mm') : '-'}`}
        </div>
      ),
      sorter: (a, b) => {
        if (!a.completeAt) {
          if (dayjs(a.createAt).isSame(b.createAt)) return 0;
          if (dayjs(a.createAt).isBefore(b.createAt)) return -1;
          return 1;
        }
        if (dayjs(a.completeAt).isSame(b.completeAt)) return 0;
        if (dayjs(a.completeAt).isBefore(b.completeAt)) return -1;
        return 1;
      },
      width: 200,
      align: 'center',
    },
    {
      title: <span style={{ paddingInline: 10 }}>訂單號</span>,
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 160,
    },
    {
      title: <span style={{ paddingInline: 10 }}>操作流水號</span>,
      key: 'serial',
      dataIndex: 'serialNum',
      width: 160,
    },
    {
      title: <div style={{ paddingInline: 10 }}>姓名(會員編號)</div>,
      key: 'memberName',
      dataIndex: 'memberName',
      render: (memberName, record) => <div>{`${memberName} (${record.memberNum})`}</div>,
      width: 120,
    },
    {
      title: '櫃台',
      key: 'counter',
      align: 'center',
      dataIndex: 'counter',
      filters: [
        {
          text: '櫃台01',
          value: '櫃台01',
        },
        {
          text: '櫃台02',
          value: '櫃台02',
        },
      ],
      width: 80,
    },
    {
      title: '類型',
      key: 'txtype',
      align: 'center',
      dataIndex: 'txtype',
      render: (txtype: TradeTypeNum) => (
        <Tag color={txtype === TradeTypeNum.CustomerBuy ? 'blue' : 'red'}>
          {txtype === TradeTypeNum.CustomerBuy ? '購買' : '出售'}
        </Tag>
      ),
      filters: [
        {
          text: '購買',
          value: '購買',
        },
        {
          text: '出售',
          value: '出售',
        },
      ],
      width: 80,
    },
    {
      title: '加密貨幣',
      key: 'quantity',
      dataIndex: 'amount',
      align: 'right',
      render: (amount: number, record) => {
        const cryptoImg = getCryptoImgs(record.crypto);
        return (
          <div>
            <Text
              strong
              style={{
                color: record.txtype === TradeTypeNum.CustomerBuy ? 'blue' : 'red',
              }}
            >
              {nTot({ value: amount, digitsType: record.crypto })}
            </Text>
            <br />
            <Space align='center'>
              <img
                src={cryptoImg}
                alt=''
                style={{ width: 14 }}
              />
              <Text type='secondary'>crypto</Text>
            </Space>
          </div>
        );
      },
      filters: [
        {
          text: 'USDT',
          value: 'USDT',
        },
        {
          text: 'ETH',
          value: 'ETH',
        },
      ],
      width: 120,
    },
    {
      title: <span style={{ paddingInline: 10 }}>匯率</span>,
      key: 'exRate',
      dataIndex: 'exRate',
      width: 120,
      align: 'right',
    },
    {
      title: '金額',
      key: 'amount',
      dataIndex: 'amount',
      align: 'center',
      render: (amount, record) => (
        <div style={{ textAlign: 'right' }}>
          {nTot({ value: amount, digitsType: 'TWD' })}
          <br />
          <Text type='secondary'>{record.currency}</Text>
        </div>
      ),
      sorter: (a, b) => a.amount - b.amount,
      width: 70,
    },
    {
      title: '手續費',
      key: 'fee',
      dataIndex: 'fee',
      align: 'center',
      render: (fee, record) => (
        <div style={{ textAlign: 'right' }}>
          {nTot({ value: fee, digitsType: 'TWD' })}
          <br />
          <Text type='secondary'>{record.currency}</Text>
        </div>
      ),
      width: 50,
    },
    {
      title: '總計',
      key: 'total',
      dataIndex: 'fee',
      align: 'right',
      render: (fee, record) => (
        <Text strong>
          {nTot({ value: tTon(fee) + tTon(record.price), digitsType: 'TWD' })}
          <br />
          <Text type='secondary'>{record.currency}</Text>
        </Text>
      ),
      sorter: (a, b) => tTon(a.fee) + tTon(a.price) - (tTon(b.fee) + tTon(b.price)),
      width: 80,
    },
    {
      title: '方式',
      key: 'payMethod',
      align: 'center',
      dataIndex: 'payMethod',
      filters: [
        {
          text: '現金',
          value: '現金',
        },
        {
          text: '轉帳',
          value: '轉帳',
        },
      ],
      width: 70,
    },
    {
      title: '錢包',
      key: 'memberAddress',
      dataIndex: 'memberAddress',
      ellipsis: {
        showTitle: false,
      },
      render: (memberAddress) => (
        <div>
          <Tooltip
            placement='topLeft'
            title={memberAddress}
          >
            <div>發送:{memberAddress}</div>
          </Tooltip>
          <Tooltip
            placement='topLeft'
            title={memberAddress}
          >
            <div>接收:{memberAddress}</div>
          </Tooltip>
        </div>
      ),
      width: 200,
    },
    {
      title: '哈希',
      key: 'hash',
      dataIndex: 'hash',
      ellipsis: {
        showTitle: false,
      },
      render: (hash) => (
        <Tooltip
          placement='topLeft'
          title={hash}
        >
          {hash}
        </Tooltip>
      ),
      width: 200,
    },
    {
      title: '操作人員',
      key: 'operator',
      dataIndex: 'operator',
      filters: [
        {
          text: '櫃台君01',
          value: '櫃台君01',
        },
        {
          text: '櫃台君02',
          value: '櫃台君02',
        },
      ],
      width: 80,
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: () => (
        <Space>
          <Tooltip
            placement='right'
            title='完成的紀錄，Admin才有?'
          >
            <Button
              type='link'
              size='small'
              href='transactionDetail'
              icon={<FileTextOutlined />}
            />
          </Tooltip>
          <Tooltip
            placement='right'
            title='列印交易合約書'
          >
            <Button
              type='link'
              size='small'
              icon={<PrinterOutlined />}
            />
          </Tooltip>
          <Tooltip
            placement='right'
            title='列印收據'
          >
            <Button
              type='link'
              size='small'
              icon={<PrinterOutlined />}
            />
          </Tooltip>
        </Space>
      ),
      width: 120,
    },
  ];

  return { columns };
};

export { useTxColumns };
