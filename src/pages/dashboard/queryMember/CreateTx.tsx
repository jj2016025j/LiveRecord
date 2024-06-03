import { CloseOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { QueryMemberRes, RateKeyTypes } from '../../../api';
import { CreatePayTypes, useUserStore } from '../../../store';
import { CryptoTypes, nTot } from '../../../utils';
import { Button, Form, Modal, Space, Tabs, TabsProps, Typography } from 'antd';
import { useTestState } from '../../../hooks';
import BuyForm from './BuyForm';
import SellForm from './SellForm';

interface ICreateTxProps {
  open: boolean;
  onCancel: () => void;
  memberInfo: QueryMemberRes | undefined;
}

const { Title } = Typography;
const CreateTx: React.FunctionComponent<ICreateTxProps> = (props) => {
  const [buyForm] = Form.useForm();
  const [sellForm] = Form.useForm();
  // DOM
  const { open, onCancel, memberInfo } = props || {};
  const [tabKey, setTabKey] = useTestState('1', '1');
  const [cryptoType, setCryptoType] = useState<CryptoTypes>('ERC20_USDT');
  const [payType, setPayType] = useState<CreatePayTypes>('cash');
  // store
  const { rates } = useUserStore();

  // 會員資訊自動填入
  useEffect(() => {
    if (!buyForm || !sellForm || !memberInfo) return;
    if (!open) {
      // 表單關閉時清除所有資訊
      buyForm.resetFields();
      sellForm.resetFields();
      return;
    }
    setTimeout(() => {
      const { idNumber, realName, userId } = memberInfo || {};
      buyForm.setFieldsValue({
        customerId: userId,
        idNumber,
        customerName: realName,
      });
      sellForm.setFieldsValue({
        customerId: userId,
        idNumber,
        customerName: realName,
      });
    }, 500);
  }, [open, memberInfo, buyForm, sellForm]);

  // 匯率手續費自動填入
  useEffect(() => {
    if (!buyForm || !sellForm || !rates || !open) return;
    const buyRate = rates?.[cryptoType.toLowerCase() as RateKeyTypes].buy;
    const sellRate = rates?.[cryptoType.toLowerCase() as RateKeyTypes].sell;
    buyForm.setFieldValue('rate', nTot({ value: buyRate, digitsType: cryptoType }));
    sellForm.setFieldValue('rate', nTot({ value: sellRate, digitsType: cryptoType }));
    // 手續費寫死
    buyForm.setFieldValue('handling', nTot({ value: 150, digitsType: 'TWD' }));
    sellForm.setFieldValue('handling', nTot({ value: 150, digitsType: 'TWD' }));
  }, [buyForm, cryptoType, payType, rates, sellForm, open]);

  //
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '客人要購買加密貨幣',
      children: (
        <BuyForm
          {...{ rates, cryptoType, setCryptoType, payType, setPayType, buyForm, memberInfo }}
          onCancelForm={onCancel}
          hideField={<Form.Item name='handling' />}
        />
      ),
    },
    {
      key: '2',
      label: '客人要出售加密貨幣',
      children: (
        <SellForm
          {...{ sellForm, cryptoType, setCryptoType, payType, setPayType, rates, memberInfo }}
          onCancelForm={onCancel}
          hideField={<Form.Item name='handling' />}
        />
      ),
    },
  ];
  return (
    <>
      <Modal
        centered
        title={
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Title level={3}>新增交易</Title>
            <Button
              type='text'
              shape='circle'
              onClick={() => onCancel()}
            >
              <CloseOutlined />
            </Button>
          </Space>
        }
        open={open}
        footer={false}
        closable={false}
      >
        <Tabs
          onChange={(value) => setTabKey(value)}
          animated
          activeKey={tabKey}
          items={items}
        />
      </Modal>
    </>
  );
};

export default CreateTx;
