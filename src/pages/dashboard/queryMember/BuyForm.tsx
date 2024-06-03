import { QueryMemberRes, RateKeyTypes, RatesRes, useCreateBuy } from '@/api';
import { Input, Select, Radio, Space, Divider, Button, Form, FormInstance } from 'antd';
import { nTot, crytTypeOptions, tTon, CryptoTypes, getCountryBankOptions, CountryKeyNum } from '@/utils';
import { CreatePayTypes } from '@/store';
import { useCallback, useState } from 'react';
import { useSubmitBuy } from '../methods';
import InputScanner from '@/components/InputScanner';
import SignatureContract, { ContractOptions } from '@/components/SignatureContract';

interface IBuyFormProps {
  cryptoType: CryptoTypes;
  setCryptoType: React.Dispatch<React.SetStateAction<CryptoTypes>>;
  payType: CreatePayTypes;
  setPayType: React.Dispatch<React.SetStateAction<CreatePayTypes>>;
  buyForm: FormInstance;
  rates: RatesRes | null;
  memberInfo: QueryMemberRes | undefined;
  onCancelForm: () => void;
  hideField?: React.ReactNode;
}

const BuyForm: React.FunctionComponent<IBuyFormProps> = (props) => {
  // DOM
  const { rates, memberInfo, cryptoType, setCryptoType, payType, setPayType, buyForm, onCancelForm, hideField } =
    props || {};
  const [contractInfo, setContractInfo] = useState<ContractOptions>();
  const buyRateValue = useCallback(() => {
    const buyRate = rates?.[cryptoType.toLowerCase() as RateKeyTypes].buy;
    return tTon(buyRate);
  }, [rates, cryptoType])();

  // mutate
  const { mutate: buy, isPending: creatingBuy } = useCreateBuy({
    onCancelForm,
    setOpenVerifyCodeModal: (value) => {
      if (!value) setContractInfo(undefined);
    },
    isTest: false,
  });

  // handlers
  const { handleSubmitBuy } = useSubmitBuy({
    cryptoType,
    setContractInfo,
    memberInfo,
    payType,
  });

  return (
    <>
      <Form
        layout='vertical'
        form={buyForm}
        onFinish={(values) => {
          if (!memberInfo) return;
          handleSubmitBuy(values);
        }}
        initialValues={{
          amount: process.env.NODE_ENV === 'development' ? '100' : '0',
          price: process.env.NODE_ENV === 'development' ? nTot({ value: 100 * buyRateValue, digitsType: 'TWD' }) : '0',
          address: process.env.NODE_ENV === 'development' ? '0xA1De32737e4A71FA72d3692e969035Cc606F8a85' : '',
        }}
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
            options={crytTypeOptions}
            onChange={(value) => {
              setCryptoType(value);
            }}
          />
        </Form.Item>

        <Form.Item
          label='加密貨幣交易數量'
          name='amount'
          rules={[{ required: true, message: '請輸入交易數量!' }]}
          normalize={(value) => nTot({ value })}
        >
          <Input
            disabled={!rates}
            placeholder={`請輸入${cryptoType}數量`}
            suffix={cryptoType}
            onChange={(e) => {
              const { value } = e.target;
              const amountValue = tTon(value);
              const price = nTot({
                value: amountValue * buyRateValue,
                digitsType: 'TWD',
              });
              buyForm.setFieldValue('price', price);
            }}
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
          rules={[{ required: true, message: '請輸入金額' }]}
          normalize={(value) => nTot({ value })}
        >
          <Input
            disabled={!rates}
            placeholder='請輸入新台幣數量'
            suffix='新台幣'
            onChange={(e) => {
              const { value } = e.target;
              const priceValue = tTon(value);
              const amount = nTot({
                value: priceValue / buyRateValue,
                digitsType: 'TWD',
              });
              buyForm.setFieldValue('amount', amount);
            }}
          />
        </Form.Item>

        <Form.Item
          label='客人的加密貨幣錢包地址'
          name='address'
          rules={[{ required: true, message: '請掃描錢包地址' }]}
        >
          <InputScanner />
        </Form.Item>

        <Form.Item
          label='交易方式'
          rules={[{ required: true, message: '請選擇交易方式' }]}
        >
          <Radio.Group
            value={payType}
            onChange={(e) => setPayType(e.target.value)}
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
              name='customerName'
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
              name='bankAccount'
              rules={[
                {
                  required: payType === 'bank',
                  message: '請輸入銀行帳號',
                },
              ]}
            >
              <Input placeholder='輸入銀行的銀行帳號' />
            </Form.Item>

            <Form.Item
              label='銀行代號'
              name='bankAccount'
              rules={[
                {
                  required: payType === 'bank',
                  message: '請選擇銀行代號',
                },
              ]}
            >
              <Select
                placeholder={'選擇銀行代號'}
                options={getCountryBankOptions(CountryKeyNum.Taiwan)}
              />
            </Form.Item>
          </>
        )}
        <Form.Item className='tight'>
          <Button
            loading={creatingBuy}
            style={{
              width: '100%',
            }}
            type='primary'
            htmlType='submit'
          >
            提交
          </Button>
        </Form.Item>

        <div style={{ visibility: 'hidden', position: 'absolute' }}>{hideField}</div>
      </Form>

      <SignatureContract
        open={!!contractInfo}
        setOpen={(value) => {
          if (!value) setContractInfo(undefined);
        }}
        onFinish={() => {
          if (!memberInfo || !contractInfo) return;
          buy({
            customerId: contractInfo.customerID || memberInfo.userId,
            customerWallet: contractInfo.walletAddress,
            cryptoAmount: tTon(contractInfo.amount),
            cryptoType: cryptoType,
          });
        }}
        {...{ contractInfo }}
      />
    </>
  );
};

export default BuyForm;
