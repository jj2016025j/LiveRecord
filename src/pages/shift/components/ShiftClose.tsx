import styles from './close.module.scss';
import { Button, Form, Input, Modal, Space } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { nTot, tTon } from '../../../utils';
import SetCounterInput from './SetCounterInput';
import { ShiftCloseProps } from '@/api';

interface IShiftCloseProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  counterAccount: string | number | undefined;
  closing: boolean;
  close: (props: ShiftCloseProps) => void;
}

const ShiftClose: React.FunctionComponent<IShiftCloseProps> = (props) => {
  // DOM
  const { open, setOpen, counterAccount, closing, close } = props || {};
  const [deviation, setDeviation] = useState<number>();
  const [setType, setSetType] = useState<number>(1);
  const accountValue = tTon(counterAccount);

  const handleSubmitclose = (values: { amount: string; set: string }) => {
    const { amount } = values || {};
    if (amount === '-1') return;
    close({});
  };

  return (
    <Modal
      title='交班'
      open={open}
      closable={false}
      centered
      onCancel={() => setOpen(false)}
      width={400}
      footer={null}
    >
      <div className={`${styles.warn}`}>
        <WarningOutlined style={{ fontSize: '48px' }} />
        <span>
          <p>請確實清點櫃台金額，輸入實際金額交班</p>
          <p>經確認如有障差請通報管理者</p>
        </span>
      </div>
      <div className={styles.form}>
        <Form
          layout='vertical'
          initialValues={{ type: setType }}
          onFinish={handleSubmitclose}
        >
          <Form.Item
            name='amount'
            label='清點櫃台金額'
            rules={[{ required: true, message: '請輸入金額' }]}
            className={'tight'}
            normalize={(value) => {
              const newValue = nTot({ value, digitsType: 'TWD' });
              return newValue;
            }}
          >
            <Input
              onChange={(e) => {
                const eValue = tTon(e.target.value);
                setDeviation(eValue - accountValue);
              }}
              placeholder='櫃台實際金額'
              autoComplete='off'
            />
          </Form.Item>

          <div className={`${styles.calc}`}>
            <table>
              <tbody>
                <tr>
                  <td>櫃台應有金額:</td>
                  <td>{nTot({ value: counterAccount, digitsType: 'TWD' })}</td>
                </tr>
                <tr>
                  <td align='right'>正負值:</td>
                  <td>
                    <p
                      style={{
                        textAlign: 'right',
                        color: deviation === 0 ? 'green' : 'red',
                      }}
                    >
                      {nTot({
                        value: deviation,
                        digitsType: 'TWD',
                      })}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Form.Item
            name='set'
            rules={[
              () => ({
                validator: (_, value) => {
                  if (setType === 1) return Promise.resolve();
                  if (!value) return Promise.reject('請輸入金額');
                  return Promise.resolve();
                },
              }),
            ]}
            normalize={(value) => nTot({ value, digitsType: 'TWD' })}
          >
            <SetCounterInput {...{ setSetType, setType }} />
          </Form.Item>

          <Space>
            <Form.Item className='tight'>
              <Button
                type='primary'
                htmlType='submit'
                loading={closing}
              >
                確認
              </Button>
            </Form.Item>
            <Button
              onClick={() => setOpen(false)}
              loading={closing}
            >
              取消
            </Button>
          </Space>
        </Form>
      </div>
    </Modal>
  );
};

export default ShiftClose;
