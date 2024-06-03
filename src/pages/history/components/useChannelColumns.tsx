import { ChannelStatus } from '@/utils';
import { TableProps, Typography, Image, Checkbox, Button } from 'antd';

const liveOptions = [
  { label: '自動錄影', value: 'autoRecord' },
  { label: '加到最愛', value: 'favorite' },
];

const { Text } = Typography;

const maxLength = 30
const useChannelColumns = (checkBoxOnChange: any) => {
  const columns: TableProps<RegistrationOptions>['columns'] = [
    {
      title: <Checkbox />,
      key: 'checked',
      align: 'center',
      render: () => {
        return <Checkbox />;
      },
      width: 50,
    },
    {
      title: '縮圖預覽',
      dataIndex: 'previewImage',
      align: 'center',
      key: 'previewImage',
      render: (previewImage) => (
        <>
          <Image src={previewImage} alt="Logo" />
        </>
      ),
      width: 80,
    },
    {
      title: '名稱',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (name) => <Text>{name || '無'}</Text>,
      width: 100,
    },
    {
      title: '網址',
      dataIndex: 'url',
      key: 'url',
      align: 'center',
      render: (url) => {
        const needsTruncation = url.length > maxLength;
        const truncatedText = needsTruncation
          ? `${url.slice(0, 4)}...${url.slice(-4)}`
          : url;
        return <Text>{truncatedText || '無'}</Text>
      },
      width: 100,
    },

    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status: ChannelStatus) => {
        if (status === ChannelStatus.Online) return <span>正在線上</span>;
        if (status === ChannelStatus.Offline) return <span>已離線</span>;
        if (status === ChannelStatus.Recording) return <span>錄製中</span>;
        if (status === ChannelStatus.Saving) return <span>正在儲存錄製</span>;
        return <span>未定義</span>;
      },
      width: 80,
    },
    {
      title: '影片大小',
      dataIndex: 'size',
      key: 'size',
      align: 'center',
      render: (status) => {
        return <Text>{status[0] + 'x' + status[1] || '無'}</Text>;
      },
      width: 80,
    },
    {
      title: '觀看人次',
      dataIndex: 'viewers',
      key: 'viewers',
      align: 'center',
      render: (viewers) => {
        return <Text>{viewers || '無'}</Text>;
      },
      width: 100,
    },
    {
      title: '其他選項',
      key: 'options',
      align: 'center',
      render: (channel) => {
        const defaultValue = [];
        if (channel.autoRecord) defaultValue.push('autoRecord');
        if (channel.isFavorite) defaultValue.push('favorite');
        return <Checkbox.Group
          options={liveOptions}
          defaultValue={defaultValue}
        // onChange={checkBoxOnChange}
        />;
      },
      width: 100,
    },
    {
      title: '已觀看',
      dataIndex: 'Viewed',
      key: 'Viewed',
      align: 'center',
      render: (Viewed) => {
        return <Text>{Viewed == true ? '已觀看' : '未觀看'}</Text>;
      },
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      align: 'center',
      render: (operate) => {
        return <Button onClick={operate}>{'查看預覽畫面'}</Button>;
      },
      width: 100,
    },
  ];
  return { columns };
};

export default useChannelColumns;
