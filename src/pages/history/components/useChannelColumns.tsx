import { useUpdateListStatus } from '@/api';
import { ChannelStatus } from '@/utils';
import { TableProps, Typography, Image, Checkbox, Button } from 'antd';
import { Link } from 'react-router-dom';

const liveOptions = [
  { label: '自動錄影', value: 'autoRecord' },
  { label: '加到最愛', value: 'isFavorite' },
];

const { Text } = Typography;

const maxLength = 30

const useChannelColumns = () => {
  const {
    mutate: updateListStatus,
  } = useUpdateListStatus({
    // isTest: true
  })

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
      title: <Checkbox />,
      key: 'checked',
      align: 'center',
      render: () => {
        return <Checkbox />;
      },
      width: 50,
    },
    {
      title: '圖片',
      dataIndex: 'preview_image',
      key: 'preview_image',
      align: 'center',
      render: (preview_image) => {
        console.log('preview_image', preview_image)
        return preview_image ?
          <img
            src={preview_image}
            alt="Preview"
            style={{ width: 50, height: 50 }}
          /> :
          <>無</>;
      },
      width: 50,
    },
    // {
    //   title: '縮圖預覽',
    //   dataIndex: 'previewImage',
    //   align: 'center',
    //   key: 'previewImage',
    //   render: (previewImage) => (
    //     <>
    //       <Image src={previewImage} alt="Logo" />
    //     </>
    //   ),
    //   width: 80,
    // },
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
        // return <Text>{truncatedText || '無'}</Text>
        return <Link
          style={{
            color: '#ED9200',
            paddingInline: 15,
          }}
          to={url}
          target='_blank'
        >
          {url || '無'}
        </Link>

      },
      width: 100,
    },

    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status: ChannelStatus) => {
        if (status === ChannelStatus.online) return <span>正在線上</span>;
        if (status === ChannelStatus.offline) return <span>已離線</span>;
        if (status === ChannelStatus.Recording) return <span>錄製中</span>;
        if (status === ChannelStatus.Saving) return <span>正在儲存錄製</span>;
        return <span>未定義</span>;
      },
      width: 80,
    },
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
      title: '已觀看',
      dataIndex: 'viewed',
      key: 'viewed',
      align: 'center',
      render: (viewed) => {
        return <Text>{viewed == true ? '已觀看' : '未觀看'}</Text>;
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
