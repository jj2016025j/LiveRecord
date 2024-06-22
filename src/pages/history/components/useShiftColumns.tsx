import { Button, Space, TableProps, Tooltip, Typography } from 'antd';
import { ShiftRecord } from '@/api';
import { nTot, tTon } from '@/utils';
import { FcViewDetails } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

type ColumnsProps = {};

const { Text } = Typography;
const useShiftColumns = ({}: ColumnsProps) => {
  const navigator = useNavigate();

  const columns: TableProps<ShiftRecord>['columns'] = [
    {
      title: '門市地點',
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
      render: (date: string) => {
        return <span>{dayjs(date).format('YYYY-MM-DD HH:mm')}</span>;
      },
    },
    {
      title: '櫃台',
      key: 'counter',
      align: 'center',
      dataIndex: 'counterNum',
      render: (num: number) => {
        return <span>{`櫃台 ${num.toString().padStart(2, '0')}`}</span>;
      },
    },
    {
      title: '櫃台總收',
      key: 'counterTotalIn',
      dataIndex: 'totalCashIn',
      align: 'right',
      sorter: (a, b) => a.totalCashIn - b.totalCashIn,
      render: (counterTotalIn, record) => (
        <div>
          {nTot({ value: counterTotalIn, digitsType: record.currency })}
          <br />
          <Text type='secondary'>{record.currency}</Text>
        </div>
      ),
    },
    {
      title: '櫃台總出',
      key: 'counterTotalOut',
      dataIndex: 'totalCashOut',
      align: 'right',
      sorter: (a, b) => a.totalCashOut - b.totalCashOut,
      render: (totalCashOut, record) => (
        <div>
          {nTot({ value: totalCashOut, digitsType: record.currency })}
          <br />
          <Text type='secondary'>{record.currency}</Text>
        </div>
      ),
    },
    {
      title: '櫃台應剩餘',
      key: 'counterShouldRemain',
      dataIndex: 'expectBalance',
      align: 'right',
      sorter: (a, b) => a.expectBalance - b.expectBalance,
      render: (expectBalance, { currency }) => (
        <div>
          <Text
            type='success'
            strong
          >
            {nTot({ value: expectBalance, digitsType: currency })}
          </Text>
          <br />
          <Text type='secondary'>{currency}</Text>
        </div>
      ),
    },
    {
      title: '櫃台實際剩餘',
      key: 'counterRealRemain',
      dataIndex: 'actualBalance',
      align: 'right',
      sorter: (a, b) => a.actualBalance - b.actualBalance,
      render: (actualBalance, { currency }) => (
        <div>
          {nTot({ value: actualBalance, digitsType: currency })}
          <br />
          <Text type='secondary'>{currency}</Text>
        </div>
      ),
    },
    {
      title: '正負值',
      key: 'difference',
      dataIndex: 'actualBalance',
      align: 'right',
      sorter: (a, b) => tTon(a.actualBalance) - tTon(a.expectBalance) - (tTon(b.actualBalance) - tTon(b.expectBalance)),
      render: (actualBalance, { expectBalance, currency }) => (
        <div>
          <Text
            strong
            type={(tTon(actualBalance) - tTon(expectBalance) < 0 && 'danger') || 'secondary'}
          >
            {nTot({
              value: tTon(actualBalance) - tTon(expectBalance),
              digitsType: currency,
            })}
          </Text>
          <br />
          <Text type='secondary'>{currency}</Text>
        </div>
      ),
    },
    {
      title: '操作人員',
      key: 'operator',
      dataIndex: 'staff',
      align: 'center',
    },
    {
      title: '操作',
      key: 'operate',
      align: 'center',
      render: (_, { id }) => {
        return (
          <Space>
            <Tooltip title='詳細資料'>
              <Button
                type='link'
                icon={<FcViewDetails />}
                onClick={() => navigator('shift', { state: { id } })}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return { columns };
};

export { useShiftColumns };
