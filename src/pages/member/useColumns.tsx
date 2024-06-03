import { Typography, TableProps, Space, Button } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { KycRecordOptions } from '../../api/member';
import { CounterTabKeys, nTot } from '../../utils';

type ColumnsType = {};

const { Text } = Typography;
const useColumns = ({}: ColumnsType) => {
  const navigate = useNavigate();

  const columns: TableProps<KycRecordOptions>['columns'] = [
    {
      title: '國家',
      dataIndex: 'country',
      key: 'country',
      align: 'center',
      onFilter: (value, record) => {
        return record.country.includes(value as string);
      },
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
      title: '註冊時間',
      dataIndex: 'registerDate',
      key: 'registerDate',
      sorter: (a, b) => {
        if (dayjs(a.registerDate).isSame(b.registerDate)) return 0;
        if (dayjs(a.registerDate).isBefore(b.registerDate)) return -1;
        return 1;
      },
    },
    {
      title: '上次審核時間',
      dataIndex: 'lastPassDate',
      key: 'lastPassDate',
      sorter: (a, b) => {
        if (dayjs(a.lastPassDate).isSame(b.lastPassDate)) return 0;
        if (dayjs(a.lastPassDate).isBefore(b.lastPassDate)) return -1;
        return 1;
      },
    },
    {
      title: '審核次數',
      dataIndex: 'verifyTimes',
      key: 'verifyTimes',
      align: 'center',
      sorter: (a, b) => a.verifyTimes - b.verifyTimes,
    },
    {
      title: '客人姓名(會員編號)',
      key: 'member',
      dataIndex: 'memberName',
      render: (value, record) => {
        return `${value} ( ${record.memberID} ) `;
      },
    },
    {
      title: '連絡電話',
      key: 'phone',
      dataIndex: 'phone',
    },
    {
      title: '交易次數',
      key: 'txTimes',
      dataIndex: 'txTimes',
      align: 'center',
      sorter: (a, b) => a.txTimes - b.txTimes,
    },
    {
      title: '成交量',
      key: 'volume',
      dataIndex: 'volume',
      align: 'right',
      render: (volume, record) => (
        <div>
          {nTot({ value: volume, digitsType: record.currency })}
          <br />
          <Text type='secondary'>{record.currency}</Text>
        </div>
      ),
      sorter: (a, b) => a.volume - b.volume,
    },

    {
      title: '操作',
      key: 'action',
      dataIndex: 'memberID',
      align: 'center',
      render: (id) => (
        <Space>
          <Button
            type='link'
            size='small'
            onClick={() => {
              navigate('detail', { state: { id } });
            }}
          >
            會員資料表
          </Button>
          <Button
            type='link'
            size='small'
          >
            審核紀錄
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() =>
              navigate('/protected/history', {
                state: { counterTab: CounterTabKeys.Trade },
              })
            }
          >
            交易紀錄
          </Button>
        </Space>
      ),
    },
  ];

  return { columns };
};

export { useColumns };
