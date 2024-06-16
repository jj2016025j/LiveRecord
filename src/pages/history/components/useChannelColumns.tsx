import { useUpdateListStatus } from '@/api';
import { ChannelStatus } from '@/utils';
import { CopyOutlined } from '@ant-design/icons';
import { TableProps, Typography, Image, Checkbox, Button, message, Tooltip } from 'antd';
import { Link } from 'react-router-dom';

const liveOptions = [
  { label: '自動錄影', value: 'autoRecord' },
  { label: '加到最愛', value: 'isFavorite' },
];

const { Text } = Typography;

const maxLength = 30

const useChannelColumns = (porps: { setLiveUrl: any; }) => {
  const {
    mutate: updateListStatus,
  } = useUpdateListStatus({
    // isTest: true

  })
  const { setLiveUrl } = porps
  const onChange = (id: any, checkedValues: string[]) => {
    console.log('checked = ', checkedValues);
    const statusUpdate = {
      urlOrNameOrId: id,  // 替换为你的实际 URL 或 ID
      isFavorite: checkedValues.includes('isFavorite'),
      autoRecord: checkedValues.includes('autoRecord'),
      viewed: checkedValues.includes('viewed')
    };
    updateListStatus(statusUpdate)
  };

  const columns: TableProps<RegistrationOptions>['columns'] = [
    {
      title: '圖片',
      dataIndex: 'preview_image',
      key: 'preview_image',
      align: 'center',
      render: (preview_image) => {
        // console.log('preview_image', preview_image);
        const imageSize = 100; // 正方形的大小
        const borderRadius = 10; // 圓角半徑
        return preview_image ? (
          <Image
            alt="Preview"
            width={imageSize}
            height={imageSize}
            src={preview_image}
            style={{
              borderRadius: `${borderRadius}px`,
              objectFit: 'cover' // 保持图片内容适应正方形
            }}
          />
        ) : (
          <>無</>
        );
      },
      width: 50,
      filters: [
        { text: '有預覽圖', value: 'haveImage' },
        { text: '沒有預覽圖', value: 'noImage' },
      ],
    },
    {
      title: '名稱',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      sorter: true,
      render: (name) => <Text>{name || '無'}</Text>,
      width: 100,
    },
    {
      title: '網址',
      dataIndex: 'url',
      key: 'url',
      align: 'center',
      sorter: true,
      render: (url) => {
        const maxLength = 50;
        const needsTruncation = url.length > maxLength;
        const truncatedText = needsTruncation
          ? `${url.slice(0, 4)}...${url.slice(-4)}`
          : url;
        const copyToClipboard = () => {
          navigator.clipboard.writeText(url)
            .then(() => {
              message.success('網址已成功複製');
            })
            .catch(err => {
              message.error('複製網址失敗');
            });
        };
        const handleLinkClick = (e: { preventDefault: () => void; }) => {
          e.preventDefault();
          window.open(url, '_blank');
        };
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={truncatedText}>
              <Link
                style={{
                  color: '#ED9200',
                  paddingInline: 15,
                }}
                onClick={handleLinkClick} to={''}              >
                {truncatedText || '無'}
              </Link>
            </Tooltip>
            <Button
              icon={<CopyOutlined />}
              onClick={copyToClipboard}
              style={{
                marginLeft: 8,
              }}
            />
          </div>
        );
      },
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      filters: [
        { text: '在線', value: 'online' },
        { text: '離線', value: 'offline' },
      ],
      render: (status: string) => {
        if (status === 'online') return <span>正在線上</span>;
        if (status === 'offline') return <span>已離線</span>;
        if (status === 'recording') return <span>錄製中</span>;
        if (status === 'saving') return <span>正在儲存錄製</span>;
        return <span>未定義</span>;
      },
      width: 80,
    },
    {
      title: '自動錄影',
      dataIndex: 'autoRecord',
      key: 'autoRecord',
      align: 'center',
      render: (autoRecord) => {
        return <Text>{autoRecord == true ? '自動錄影' : '不自動錄影'}</Text>;
      },
      width: 100,
      filters: [
        { text: '自動錄影', value: 'true' },
        { text: '不自動錄影', value: 'false' },
      ],
    },
    {
      title: '其他選項',
      key: 'options',
      align: 'center',
      render: (channel) => {
        const defaultValue = [];
        if (channel.autoRecord) defaultValue.push('autoRecord');
        if (channel.isFavorite) defaultValue.push('isFavorite');
        return <Checkbox.Group
          options={liveOptions}
          defaultValue={defaultValue}
          onChange={(value) => { onChange(channel.id, value) }}
        />;
      },
      width: 100,
    },
    {
      title: '操作',
      key: 'operate',
      align: 'center',
      render: (record) => {
        return <Button onClick={setLiveUrl(record.live_stream_url)}>{'查看預覽畫面'}</Button>;
      },
      width: 100,
    },
    // {
    //   title: '最愛',
    //   dataIndex: 'viewed',
    //   key: 'viewed',
    //   align: 'center',
    //   render: (viewed) => {
    //     return <Text>{viewed == true ? '已觀看' : '未觀看'}</Text>;
    //   },
    //   width: 100,
    // },
    // {
    //   title: '已觀看',
    //   dataIndex: 'viewed',
    //   key: 'viewed',
    //   align: 'center',
    //   render: (viewed) => {
    //     return <Text>{viewed == true ? '已觀看' : '未觀看'}</Text>;
    //   },
    //   width: 100,
    // },
    // {
    //   title: '影片大小',
    //   dataIndex: 'size',
    //   key: 'size',
    //   align: 'center',
    //   render: (status) => {
    //     return <Text>{status[0] + 'x' + status[1] || '無'}</Text>;
    //   },
    //   width: 80,
    // },
    // {
    //   title: '觀看人次',
    //   dataIndex: 'viewers',
    //   key: 'viewers',
    //   align: 'center',
    //   render: (viewers) => {
    //     return <Text>{viewers || '無'}</Text>;
    //   },
    //   width: 100,
    // },
  ];
  return { columns };
};

export default useChannelColumns;
