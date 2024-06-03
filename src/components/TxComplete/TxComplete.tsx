import { useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Card, Space, Button, Typography, Descriptions, DescriptionsProps } from 'antd';
import SignatureContract from '../SignatureContract';

const { Title, Text, Link } = Typography;

const items2: DescriptionsProps['items'] = [
  {
    key: '1',
    label: '發送錢包地址',
    children: 'TWxcf1698ef1365f46ef8749e8',
  },
  {
    key: '2',
    label: '接收錢包地址',
    children: 'Tasjio54qwSAD846asd48q6f46',
  },
  {
    key: '3',
    label: 'HASH',
    children: <Text copyable>498aa8s4d98s4rth9ft8i4k654sdf98sd40</Text>,
  },
];

const TxComplete: React.FunctionComponent = () => {
  const [openContract, setOpenContract] = useState(false);

  return (
    <div className='page'>
      <div
        className='pageContent'
        style={{ maxWidth: 900 }}
      >
        <Card
          title={
            <Space
              size='large'
              align='baseline'
            >
              <Text>
                訂單號: <Text copyable>clientBuyUSDT001</Text>
              </Text>
              <Text>
                PPAP訂單號:<Text copyable>USDTOut000</Text>
              </Text>
              <Text>
                交易合約書:
                <Link onClick={() => setOpenContract(true)}>20240314000001</Link>
              </Text>
            </Space>
          }
        >
          <Title style={{ textAlign: 'center', color: '#FDA200' }}>
            <Space direction='vertical'>
              <CheckCircleOutlined style={{ fontSize: 80 }} />
              成功
            </Space>
          </Title>
          <Title style={{ textAlign: 'center', color: 'red' }}>
            <Space direction='vertical'>
              <CloseCircleOutlined style={{ fontSize: 80 }} />
              取消
            </Space>
          </Title>
          <Descriptions
            items={items2}
            column={1}
            contentStyle={{ justifyContent: 'end' }}
            size='small'
          />
          <Button
            type='primary'
            block
            href='admin'
          >
            通知櫃台完成交易
          </Button>
        </Card>
        <SignatureContract
          {...{ contractInfo: undefined }}
          open={openContract}
          setOpen={setOpenContract}
        />
      </div>
    </div>
  );
};
export default TxComplete;
