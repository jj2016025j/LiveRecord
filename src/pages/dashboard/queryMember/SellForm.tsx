import { Input, Select, Radio, Space, Divider, Button, FormInstance, Form } from 'antd';
import { CryptoTypes, crytTypeOptions, nTot, tTon } from '@/utils';
import { QueryMemberRes, RateKeyTypes, RatesRes, useCreateSell } from '@/api';
import { CreatePayTypes } from '@/store';
import { useCallback, useState } from 'react';
import { useSubmitSell } from '../methods';
import SignatureContract, { ContractOptions } from '@/components/SignatureContract';

interface ISellFormProps {
  sellForm: FormInstance;
  cryptoType: CryptoTypes;
  setCryptoType: React.Dispatch<React.SetStateAction<CryptoTypes>>;
  payType: CreatePayTypes;
  setPayType: React.Dispatch<React.SetStateAction<CreatePayTypes>>;
  rates: RatesRes | null;
  onCancelForm: () => void;
  hideField?: React.ReactNode;
  memberInfo: QueryMemberRes | undefined;
}

const SellForm: React.FunctionComponent<ISellFormProps> = (props) => {
  // DOM
  const { sellForm, memberInfo, onCancelForm, cryptoType, setCryptoType, payType, setPayType, rates, hideField } =
    props || {};
  const [contractInfo, setContractInfo] = useState<ContractOptions>();
  const sellRateValue = useCallback(() => {
    const sellRate = rates?.[cryptoType.toLowerCase() as RateKeyTypes].sell;
    return tTon(sellRate);
  }, [rates, cryptoType])();
  // mutate
  const { data: sellData, mutate: sell, isPending: creatingSell, reset: resetSellData } = useCreateSell({

  });

  // handlers
  const { handleSubmitSell } = useSubmitSell({
    setContractInfo,
    memberInfo,
    cryptoType,
    payType,
  });

  return (
    <>
      <Form
        layout='vertical'
        form={sellForm}
        initialValues={
          process.env.NODE_ENV === 'development'
            ? {
              amount: 100,
              price: nTot({ value: 100 * sellRateValue, digitsType: 'TWD' }),
            }
            : {}
        }
        onFinish={handleSubmitSell}
      >
        <Form.Item
          label='會員編號'
          name='customerId'
        >
          <Input
            readOnly
            placeholder='載入中...'
          />
        </Form.Item>

        <Form.Item
          label='客人姓名'
          name='customerName'
        >
          <Input
            readOnly
            placeholder='載入中...'
          />
        </Form.Item>

        <Form.Item label='加密貨幣種類'>
          <Select
            value={cryptoType}
            onChange={(value) => setCryptoType(value)}
            options={crytTypeOptions}
          />
        </Form.Item>

        <Form.Item
          label='加密貨幣交易數量'
          name='amount'
          rules={[
            {
              required: true,
              validator: (_, value) => {
                if (!value) return Promise.reject('請輸入交易數量!');
                return Promise.resolve();
              },
            },
          ]}
          normalize={(value) => nTot({ value })}
        >
          <Input
            onChange={(e) => {
              const { value } = e.target;
              const priceValue = sellRateValue * tTon(value);
              const price = nTot({ value: priceValue, digitsType: 'TWD' });
              sellForm.setFieldValue('price', price);
            }}
            placeholder={`請輸入${cryptoType}數量`}
            suffix={cryptoType}
          />
        </Form.Item>

        <Form.Item
          label='匯率'
          name='rate'
        >
          <Input
            readOnly
            placeholder='查詢匯率中...'
          />
        </Form.Item>
        <Form.Item
          label='法幣金額'
          name='price'
          rules={[
            {
              required: true,
              validator: (_, value) => {
                if (!value) return Promise.reject('請輸入交易數量!');
                return Promise.resolve();
              },
            },
          ]}
          dependencies={['amount']}
          normalize={(value) => nTot({ value })}
        >
          <Input
            placeholder='請輸入新台幣數量'
            suffix='新台幣'
            onChange={(e) => {
              if (sellRateValue === 0) return;
              const { value } = e.target;
              const amountValue = tTon(value) / sellRateValue;
              const amount = nTot({
                value: amountValue,
                digitsType: cryptoType,
              });
              sellForm.setFieldValue('amount', amount);
            }}
          />
        </Form.Item>
        <Form.Item label='交易方式'>
          <Radio.Group
            onChange={(e) => setPayType(e.target.value)}
            value={payType}
          >
            <Space>
              <Radio value={'cash'}>現金</Radio>
              <Radio value={'bank'}>轉帳</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        {payType === 'bank' && (
          <>
            <Divider>轉帳資訊</Divider>
            <Form.Item
              label='銀行戶名'
              name='accounttName'
              rules={[
                {
                  required: payType === 'bank',
                  message: '請輸入銀行戶名',
                },
              ]}
            >
              <Input placeholder='客人的銀行戶名' />
            </Form.Item>

            <Form.Item
              label='銀行帳號'
              name='account'
              rules={[
                {
                  required: payType === 'bank',
                  message: '請輸入銀行帳號',
                },
              ]}
            >
              <Input placeholder='客人的銀行帳號' />
            </Form.Item>

            <Form.Item
              label='銀行代號'
              name='code'
              rules={[
                {
                  required: payType === 'bank',
                  message: '請輸入銀行帳號',
                },
              ]}
            >
              <Input placeholder='客人的銀行代碼' />
            </Form.Item>
          </>
        )}

        <Form.Item className='tight'>
          <Button
            loading={creatingSell}
            type='primary'
            htmlType='submit'
            style={{ width: '100%' }}
          >
            提交
          </Button>
        </Form.Item>

        <div style={{ visibility: 'hidden', position: 'absolute' }}>{hideField}</div>
      </Form>

      <SignatureContract
        {...{ contractInfo, sellData, isLoading: creatingSell,resetSellData }}
        open={!!contractInfo}
        setOpen={(isOpen) => {
          if (!isOpen) setContractInfo(undefined);
        }}
        onFinish={() => {
          if (!memberInfo || !contractInfo) return;
          sell({
            customerId: contractInfo.customerID || memberInfo?.userId,
            cryptoAmount: contractInfo.amount.toString(),
            cryptoType: contractInfo.cryptoType,
          });
          onCancelForm()
        }}
      />
    </>
  );
};

export default SellForm;
