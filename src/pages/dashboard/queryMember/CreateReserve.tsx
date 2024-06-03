import { QueryMemberRes, useCreateChannel } from '@/api';
import { IoIosClose } from 'react-icons/io';
import { Button, DatePicker, Form, Input, Modal, Radio, Space } from 'antd';
import { useEffect } from 'react';
import { crytTypeOptions, tradeAmountRangeOptions } from '@/utils';
import TimeSelector from '@/components/TimeSelector';
import dayjs from 'dayjs';
import { useHandleChannel } from '../methods';

interface ICreateChannelProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  memberInfo: QueryMemberRes | undefined;
}

const CreateChannel: React.FunctionComponent<ICreateChannelProps> = (props) => {
  const [form] = Form.useForm();
  // DOM
  const { open, setOpen, memberInfo } = props || {};
  const { mutate: create, isPending: creating } = useCreateChannel({
    isTest: true,
    setOpen,
  });

  // handlers
  const { handleSubmitChannel } = useHandleChannel({
    id: memberInfo?.idNumber,
    createChannel: create,
  });

  // init
  useEffect(() => {
    if (!form || !memberInfo) return;
    form.setFieldValue('name', memberInfo.realName);
    form.setFieldValue('id', memberInfo.idNumber);
  }, [form, memberInfo]);

  return (
    <>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={false}
        closable={false}
        centered
        title={
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space size='large'>
              <div>新增預約</div>
              <div>{`${memberInfo?.realName} (${memberInfo?.idNumber}) `}</div>
            </Space>
            <Button
              size='large'
              type='text'
              shape='circle'
              icon={<IoIosClose style={{ fontSize: 24 }} />}
              onClick={() => setOpen(false)}
            />
          </Space>
        }
      >
        <Form
          form={form}
          layout='vertical'
          initialValues={{
            cryptoType: crytTypeOptions.at(0)?.value,
            amountLevel: tradeAmountRangeOptions.at(0)?.value,
            date: dayjs().add(1, 'week'),
            time: { hours: 19, minutes: 0 },
          }}
          onFinish={handleSubmitChannel}
        >
          <Form.Item
            name='name'
            label='姓名'
            rules={[{ required: true, message: '請重新查詢會員' }]}
          >
            <Input
              readOnly
              disabled={creating}
            />
          </Form.Item>

          <Form.Item
            name='cryptoType'
            label='交易幣別'
            rules={[{ required: true, message: '請選擇幣別' }]}
          >
            <Radio.Group
              disabled={creating}
              options={crytTypeOptions}
            />
          </Form.Item>

          <Form.Item
            name='amountLevel'
            label='交易區間'
            rules={[{ required: true, message: '請選擇交易區間' }]}
          >
            <Radio.Group
              disabled={creating}
              options={tradeAmountRangeOptions}
            />
          </Form.Item>

          <Space>
            <Form.Item
              name='date'
              label='日期'
              rules={[{ required: true, message: '請選擇日期' }]}
            >
              <DatePicker disabled={creating} />
            </Form.Item>

            <Form.Item
              name='time'
              label='時間'
              rules={[{ required: true, message: '請選擇時間' }]}
            >
              <TimeSelector
                disabled={creating}
                style={{ marginLeft: 10 }}
              />
            </Form.Item>
          </Space>

          <Form.Item className='tight'>
            <Button
              loading={creating}
              type='primary'
              style={{ width: '100%' }}
              htmlType='submit'
            >
              送出
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateChannel;
