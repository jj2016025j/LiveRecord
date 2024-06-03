import { Button, Image, Card, Checkbox, Descriptions, DescriptionsProps, Empty, Form, Input, Modal, Space, Typography, GetProp } from 'antd';
import { useQueryChannel } from '@/api';
import { useEffect } from 'react';

interface IQueryMemberProps { }
const options = [
  { label: '自動錄影', value: 'autoRecord' },
  { label: '加到最愛', value: 'favorite' },
];

const { Title, Text } = Typography;
export type QueryStautsType = 'idle' | 'success' | 'empty';
const QueryMember: React.FunctionComponent<IQueryMemberProps> = ({ }) => {
  const [form] = Form.useForm();

  const {
    mutate,
    data,
    reset,
    isPending
  } = useQueryChannel({
    // isTest: true
  })

  // const warning = () => {
  //   Modal.warning({
  //     title: '重複新增',
  //     content: '該用戶已新增過',
  //   });
  // };

  // const error = () => {
  //   Modal.error({
  //     title: '查詢失敗',
  //     content: '找不到用戶',
  //   });
  // };

  const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    console.log('checked = ', checkedValues);
  };

  const maxLength = 30
  const url = data?.url || ''
  const needsTruncation = url.length > maxLength;
  const truncatedText = needsTruncation
    ? `${url.slice(0, 4)}...${url.slice(-4)}`
    : url;
  const itemsData = data

  useEffect(() => {
    form.setFieldsValue({ customerId: 'https://www.youtube.com/watch?v=21X5lGlDOfg' })
  })

  const items: DescriptionsProps['items'] = (data && itemsData)
    ? [
      {
        key: 'name',
        label: '名稱',
        children: itemsData.name,
      },
      {
        key: 'url',
        label: '網址',
        children: truncatedText,
      },
      {
        key: 'status',
        label: '狀態',
        children: <span>已離線</span>,
      },
      {
        key: 'size',
        label: '影片大小',
        children: itemsData.size[0] + '\nx' + itemsData.size[1],
      },
      {
        key: 'viewers',
        label: '觀看人次',
        children: itemsData.viewers,
      },
      {
        key: 'viewers',
        label: '觀看人次',
        children:
          <Text>{itemsData.viewers || '無'}</Text>
      },
      {
        key: 'options',
        label: '其他選項',
        children:
          <Checkbox.Group options={options} defaultValue={['自動錄影']} onChange={onChange} />
      },
      {
        key: 'Viewed',
        label: '已查看',
        children:
          <Text>{itemsData.Viewed == true ? '已查看' : '未查看'}</Text>
      },
      {
        key: 'operate',
        label: '操作',
        children:
          <Button onClick={() => { }}>{'查看預覽畫面'}</Button>
      },
      {
        key: 'preview',
        label: '縮圖預覽',
        children: (
          <div>
            {itemsData.previewImage ? (
              <Image src={itemsData.previewImage} alt="Logo" style={{ height: '50px' }} />
            ) : (
              <Empty description='尚未上傳' />
            )}
            <br />
          </div>
        ),
      },
    ]
    : [];

  return (
    <>
      <Card
        styles={{
          header: { borderBottom: 0 },
        }}
        style={{ marginBottom: 10 }}
        title={
          <Title
            level={4}
            style={{ fontWeight: 'bold', margin: 0 }}
          >
            新增交易
          </Title>
        }
      >
        <Form
          layout='vertical'
          form={form}
          onFinish={(form) => mutate({ urlOrName: form.customerId })}
          initialValues={{ customerId: 'https://www.youtube.com/watch?v=21X5lGlDOfg' }}
        >
          <Form.Item
            label='輸入網址/用戶名稱'
            name='customerId'
            rules={[
              {
                required: true,
                message: '請輸入會員編號!',
              },
            ]}
          >
            <Input
              placeholder='輸入網址/用戶名稱'
            />
          </Form.Item>
          <Space>
            <Form.Item>
              <Button
                loading={false}
                type='primary'
                htmlType='submit'
              >
                查詢/新增
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                onClick={() => {
                  form.resetFields();
                  reset()
                }}
              >
                清除
              </Button>
            </Form.Item>
          </Space>
        </Form>
        {isPending && '載入中'}
        {
          !!data && (
            <Descriptions
              items={items}
              bordered
              size='small'
              column={{
                xxl: 3,
                xl: 2,
                lg: 2,
                md: 2,
              }}
            />
          )
        }
        {
          !data && <Empty description='查無會員，請引導客人至網站註冊' />
        }
      </Card >
    </>
  );
};

export default QueryMember;
