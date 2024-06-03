import { Button, Card, Form, FormInstance, Input, InputProps, Space, Select, message } from 'antd';
const { Option } = Select
import { MdOutlineQrCodeScanner } from 'react-icons/md';
import { useLogin } from '../../api';
import { initLoginForm } from '../../utils/initData';
import { useSubmitLogin } from './methods';
import { useEffect } from 'react';
const initData = initLoginForm({ isTest: true });

type InputScannerProps = InputProps & {
  loginForm: FormInstance<any>;
};
const InputScanner = (props: InputScannerProps) => {
  const { loginForm, ...inputProps } = props;
  const inputValue = inputProps.value?.toString();
  const showValue = inputValue ? `${inputValue?.slice(0, 10)}...${inputValue?.slice(-5)}` : '';
  return (
    <Space style={{ width: '100%' }}>
      <Input
        placeholder='請掃描櫃台QR code'
        readOnly
        {...inputProps}
        value={showValue}
      />
      {import.meta.env.DEV && (
        <Button
          type='link'
          icon={<MdOutlineQrCodeScanner />}
          onClick={() => loginForm.setFieldValue('counterId', '3113cb06-6ff0-45e7-8f4d-d23132a1302d')}
        />
      )}
    </Space>
  );
};

const LoginPage: React.FunctionComponent = () => {
  const [form] = Form.useForm();

  const InDevelopment = true

  const onGenderChange = (value: string) => {
    switch (value) {
      case 'Ben':
        form.setFieldsValue({ counterId: '3113cb06-6ff0-45e7-8f4d-d23132a1302d', userName: 'store', password: '123456aA', });
        break;
      case 'Johnson':
        form.setFieldsValue({ counterId: '9095098d-a3c6-4e9a-90a6-8478bcf45ff2', userName: 'store2', password: '123456aA', });
        break;
    }
  };

  useEffect(() => {
    if (InDevelopment) {
      form.setFieldsValue({
        developerUser: 'Ben',
        counterId: '3113cb06-6ff0-45e7-8f4d-d23132a1302d',
        userName: 'store',
        password: '123456aA',
      });
    }
  }, [])

  // mutate
  const { mutate: login, isPending: underlogin } = useLogin({ isTest: true });

  // handlers
  const handleSubmitLogin = useSubmitLogin(login);

  return (
    <>
      <Card
        title={<div style={{ textAlign: 'center' }}>登入</div>}
        style={{ minWidth: 300 }}
      >
        <Form
          form={form}
          onFinish={handleSubmitLogin}
          initialValues={initData}
        >
          {InDevelopment &&
            (<Form.Item
              label={<div>開發者用戶</div>}
              name='developerUser'
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="選擇開發者用戶"
                onChange={onGenderChange}
                allowClear
              >
                <Option value="Ben">Ben</Option>
                <Option value="Johnson">Johnson</Option>
                <Option value="other">other</Option>
              </Select>
            </Form.Item>)
          }

          <Form.Item
            label={<div>櫃台</div>}
            name='counterId'
            rules={[
              {
                required: true,
                message: '請掃描櫃台QR code',
              },
            ]}
          >
            <InputScanner loginForm={form} />
          </Form.Item>

          <Form.Item
            name='userName'
            label={<div>名稱</div>}
            rules={[
              {
                required: true,
                message: '請輸入名稱',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name='password'
            label={<div>密碼</div>}
            rules={[
              {
                required: true,
                message: '請輸入密碼',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item className='tight'>
            <Button
              htmlType='submit'
              loading={underlogin}
              type='primary'
              style={{ width: '100%' }}
            >
              確認
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default LoginPage;
