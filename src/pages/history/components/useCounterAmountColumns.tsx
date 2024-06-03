import { TableProps, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { CounterOperateRecord } from '@/api';

type ColumnsProps = {};

const { Text } = Typography;
const useCounterAmountColumns = (props: ColumnsProps) => {
  const {} = props || {};
  const columns: TableProps<CounterOperateRecord>['columns'] = [
    {
      title: '國家',
      dataIndex: 'country',
      key: 'country',
      align: 'center',
      filters: [
        {
          text: '台灣',
          value: '台灣',
        },
        {
          text: '香港',
          value: '香港',
        },
        {
          text: '越南',
          value: '越南',
        },
      ],
    },
    {
      title: '門市',
      dataIndex: 'store',
      key: 'store',
      align: 'center',
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
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => {
        if (dayjs(a.date).isSame(b.date)) return 0;
        if (dayjs(a.date).isBefore(b.date)) return -1;
        return 1;
      },
      render: (date) => {
        return dayjs(date).format('YYYY-MM-DD HH:mm');
      },
    },
    {
      title: '操作流水號',
      dataIndex: 'serialNum',
      key: 'serialNum',
    },
    {
      title: '櫃台',
      key: 'counter',
      dataIndex: 'counter',
      align: 'center',
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
    },
    {
      title: '類型',
      key: 'type',
      dataIndex: 'type',
      align: 'center',
      render: (type) => (
        <Tag color={type === 3 || 4 ? 'purple' : '' || type === 1 ? 'blue' : '' || type === 2 ? 'red' : ''}>
          {type === 1
            ? '購買'
            : null || type === 2
              ? '出售'
              : null || type === 3
                ? '補入'
                : null || type === 4
                  ? '取出'
                  : null}
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
        {
          text: '補入',
          value: '補入',
        },
        {
          text: '取出',
          value: '取出',
        },
      ],
    },
    {
      title: '金額',
      key: 'amount',
      dataIndex: 'amount',
      align: 'right',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => (
        <div>
          <Text
            strong
            style={{
              color: amount === 3 || 4 ? 'purple' : '' || amount === 1 ? 'blue' : '' || amount === 2 ? 'red' : '',
            }}
          >
            {amount}
          </Text>
          <br />
          <Text type='secondary'>currency</Text>
        </div>
      ),
    },
    {
      title: '結餘',
      key: 'balance',
      dataIndex: 'balance',
      align: 'right',
      sorter: (a, b) => a.balance - b.balance,
      render: (balance) => (
        <Text strong>
          {balance}
          <br />
          <Text type='secondary'>currency</Text>
        </Text>
      ),
    },
    {
      title: '操作人員',
      key: 'operator',
      dataIndex: 'operator',
      align: 'center',
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
    },
  ];

  return { columns };
};

export { useCounterAmountColumns };
