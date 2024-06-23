import { Button, Image, Card, Checkbox, Descriptions, DescriptionsProps, Empty, Form, Input, Modal, Space, Typography, GetProp } from 'antd';
import { useQueryChannel, useUpdateListStatus } from '@/api';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface IQueryMemberProps {
  setLiveUrl: any
}
const options = [
  { label: '自動錄影', value: 'auto_record' },
  { label: '加到最愛', value: 'isFavorite' },
];

const { Title, Text } = Typography;
export type QueryStautsType = 'idle' | 'success' | 'empty';
const QueryMember: React.FunctionComponent<IQueryMemberProps> = ({ setLiveUrl }) => {
  const [form] = Form.useForm();
  const [oldLiveUrl, setOldLiveUrl] = useState<string>('')

  const {
    mutate: QueryChannel,
    data: ChannelInfo,
    reset: resetChannelInfo,
    isPending: isQuerying
  } = useQueryChannel({
    // isTest: true
  })

  const {
    mutate: updateListStatus,
  } = useUpdateListStatus({
    // isTest: true
  })
  useEffect(() => {
    if (ChannelInfo) {
      setOldLiveUrl(ChannelInfo.live_stream_url);
      // setLiveUrl(ChannelInfo.live_stream_url); // 更新 liveUrl 狀態
    }
  }, [ChannelInfo, setLiveUrl]);
  

  const maxLength = 30
  const url = ChannelInfo?.url || ''
  const needsTruncation = url.length > maxLength;
  // const truncatedText = needsTruncation
  //   ? `${url.slice(0, 4)}...${url.slice(-4)}`
  //   : url;

  const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    console.log('checked = ', checkedValues);

    const statusUpdate = {
      urlOrNameOrId: ChannelInfo?.id,
      isFavorite: checkedValues.includes('isFavorite'),
      auto_record: checkedValues.includes('auto_record'),
      viewed: checkedValues.includes('viewed')
    };
    updateListStatus(statusUpdate)
  };

  const items: DescriptionsProps['items'] = (ChannelInfo)
    ? [

      {
        key: 'preview_image',
        label: '預覽圖',
        children: (ChannelInfo.preview_image ?
          <Image
            alt="Preview"
            width={200}
            src={ChannelInfo.preview_image}
          /> : <>無</>)
      },
      {
        key: 'id',
        label: '編號ID',
        children: ChannelInfo.id,
      },
      {
        key: 'name',
        label: '名稱',
        children: ChannelInfo.name,
      },
      {
        key: 'url',
        label: '網址',
        children: <Link
          style={{
            color: '#ED9200',
            paddingInline: 15,
          }}
          to={ChannelInfo.url}
          target='_blank'
        >
          {url || '無'}
        </Link>,
      },
      {
        key: 'status',
        label: '狀態',
        children:
          ChannelInfo.status == 'online' ? <span style={{ color: 'green' }}>正在線上</span> :
            ChannelInfo.status == 'offline' ? <span style={{ color: 'gray' }}>已離線</span> :
              ChannelInfo.status == 'recording' ? <span style={{ color: 'red' }}>正在錄製</span> :
                ChannelInfo.status == 'error' ? <span style={{ color: 'yellow' }}>發生錯誤</span> :
                  <span>未定義的狀態</span>,
      },
      // {
      //   key: 'size',
      //   label: '影片大小',
      //   children: ChannelInfo.size[0] + '\nx' + ChannelInfo.size[1],
      // },
      // {
      //   key: 'viewers',
      //   label: '觀看人次',
      //   children: ChannelInfo.viewers,
      // },
      // {
      //   key: 'viewers',
      //   label: '觀看人次',
      //   children:
      //     <Text>{ChannelInfo.viewers || '無'}</Text>
      // },
      {
        key: 'options',
        label: '其他選項',
        children: (
          <Checkbox.Group
            options={options}
            defaultValue={['auto_record']}
            onChange={onChange}
          />
        ),
      },
      // {
      //   key: 'viewed',
      //   label: '已查看',
      //   children:
      //     <Text>{ChannelInfo.viewed == true ? '已查看' : '未查看'}</Text>
      // },
      {
        key: 'operate',
        label: '操作',
        children:
          <Button disabled={!oldLiveUrl} onClick={() => {
            console.log('oldLiveUrl', oldLiveUrl)
            setLiveUrl(oldLiveUrl)
          }}>{'查看預覽畫面'}</Button>
      },
      // {
      //   key: 'preview',
      //   label: '縮圖預覽',
      //   children: (
      //     <div>
      //       {ChannelInfo.previewImage ? (
      //         <Image src={ChannelInfo.previewImage} alt="Logo" style={{ height: '50px' }} />
      //       ) : (
      //         <Empty description='尚未上傳' />
      //       )}
      //       <br />
      //     </div>
      //   ),
      // },
    ]
    : [];

  return (
    <>
      <Card style={{ marginBottom: 10 }}>
        <Title
          level={5}
          style={{ fontWeight: 'bold', margin: 0 }}
        >
          頻道查詢
        </Title>

        <Form
          layout='vertical'
          form={form}
          onFinish={(form) => QueryChannel({ urlOrNameOrId: form.customerId })}
          initialValues={{ customerId: 'https://chaturbate.com/evapunkprincess/' }}
        >
          <Form.Item
            label='輸入網址/用戶名稱'
            name='customerId'
            rules={[{ required: true, message: '請輸入會員編號!' }]}
          >
            <Input placeholder='輸入網址/用戶名稱' />
          </Form.Item>
          <Space>
            <Form.Item>
              <Button loading={isQuerying} type='primary' htmlType='submit'>
                查詢/新增
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                onClick={() => {
                  form.resetFields();
                  resetChannelInfo()
                }}
              >
                清除
              </Button>
            </Form.Item>
          </Space>
        </Form>
        {isQuerying && '載入中'}
        {ChannelInfo ? (
          <Descriptions
            items={items}
            bordered
            size='small'
            column={{ xxl: 3, xl: 2, lg: 2, md: 2 }}
          />
        ) : (
          <Empty description='查無會員，請引導客人至網站註冊' />
        )}
      </Card >
    </>
  );
};

export default QueryMember;
