import { Button, Form, Input, InputRef, Modal, Space, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { LoginProps } from "../api";
import { errorCast } from "../utils";
import { forage, forageKeys } from "../utils/foragePkg";
import { useManualBlockchainConfirm } from '@/api';
interface VerifyCodeModalprops {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
  isLoading?: boolean;
  needHash?: boolean;
}

const isTest = true;
const { Title } = Typography;
export const VerifyCodeModal: React.FunctionComponent<VerifyCodeModalprops> = (
  // prettier-ignore
  { open, onCancel, onOk, isLoading, needHash }
) => {
  const [txHash, setTxHash] = useState<string>('')
  const [form] = Form.useForm();
  const passwordInputRef = useRef<InputRef>(null);
  // DOM
  const { mutate: manualConfirm } = useManualBlockchainConfirm({});

  const sendManualConfirm = (TxHash: string) => {
    manualConfirm({ hash: TxHash })
  }

  // 設定開啟時自動focus
  useEffect(() => {
    const inputCurrent = passwordInputRef.current;
    if (!open || !inputCurrent) return;
    inputCurrent.focus();
  }, [open]);

  // 開發自動填入密碼
  useEffect(() => {
    if (!open || !form || !isTest || process.env.NODE_ENV !== "development")
      return;
    forage().getItem<LoginProps>(forageKeys.loginProps, (_, loginProps) => {
      if (loginProps) form.setFieldValue("password", loginProps.password);
    });
  }, [form, open]);

  return (
    <div>
      <Modal
        footer={null}
        title={<Title level={3}>驗證</Title>}
        open={open}
        onCancel={onCancel}
        closable={false}
        centered
        onOk={onOk}
      >
        <Form
          form={form}
          onFinish={(values: { password: string | null }) => {
            forage().getItem<LoginProps>(
              forageKeys.loginProps,
              (_, loginProps) => {
                if (loginProps?.password !== values.password)
                  errorCast("密碼不相符");
                else {
                  onOk()
                  if (needHash) sendManualConfirm(txHash)
                };
              }
            );
          }}
        >
          <Form.Item
            name="password"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) return Promise.reject("請輸入驗證碼");
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password
              autoFocus
              autoComplete="off"
              placeholder="輸入驗證碼"
              ref={passwordInputRef}
            />
          </Form.Item>
          {needHash &&
            <Form.Item
              name="hash">
              <h3>輸入Hash</h3>
              <Input
                defaultValue={'0xb3d593f98a41560f5820cd45c7d591b70a465eaf8f8930fc8bdeeaf2fc5ac89e'}
                placeholder="請輸入hash碼..."
                onChange={(e) => setTxHash(e.target.value)} />
            </Form.Item>
          }

          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Form.Item className="tight">
              <Button type="primary" htmlType="submit" loading={isLoading}>
                送出
              </Button>
            </Form.Item>

            <Button onClick={() => onCancel()} loading={isLoading}>
              取消
            </Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};
