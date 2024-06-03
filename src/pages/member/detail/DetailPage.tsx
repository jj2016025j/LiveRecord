import { PrinterFilled } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { useKycDetail, useKycImages, useSendKyc, useUpdateKycStatus } from '../../../api/member';
import { BackBtn } from '../../../components/BackBtn';
import MutiImageField from './MutiImageField';
import { Button, Card, Checkbox, DatePicker, Divider, Form, Input, Radio, Skeleton, Space, Typography } from 'antd';
import { VerifyStatusNum, kycFieldOptions, verifyStatusOptions } from '../../../utils';
import { useRef, useState } from 'react';
import { VerifyCodeModal } from '../../../components/VerifyCodeModal';
import { DetailFormSubmit, useHandleTransProps } from './method';
import TodosFlow from '@/components/TodosFlow';
import VerifyStatusLabel from './components/VerifyStatusLabel';
import AntSelect from '@/components/AntSelect';

const { Title } = Typography;

interface IDetailPageProps {}
const DetailPage: React.FunctionComponent<IDetailPageProps> = (props) => {
  const location = useLocation();
  const [form] = Form.useForm();
  const sameAddressTemp = useRef(''); // 當勾選同戶籍地址時紀錄原本的資料
  // DOM
  const {} = props || {};
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatusNum>();
  const [submitDatas, setSubmitDatas] = useState<DetailFormSubmit>(); // 暫存提交資訊做驗證碼驗證後使用 handleTransProps 提交
  // query
  const { frontImg, backImg, holdImg } = useKycImages({ id: location.state?.id });
  const { detail, isPending, setDetail } = useKycDetail({
    setVerifyStatus,
    form,
    enabled: !!location.state.id,
    params: { userId: location.state.id },
  });
  const {
    mutate: send,
    isPending: sending,
    data: sendRes,
  } = useSendKyc({
    setSubmitDatas,
  });
  const { mutate: updateStaus } = useUpdateKycStatus({ setSubmitDatas, setDetail });

  // handler
  const handleTrans = useHandleTransProps(send, detail?.kycVerifyStatus, updateStaus, location.state.id);

  if (!isPending) {
    return (
      <>
        <TodosFlow
          {...{
            todos: [],
            isTest: true,
            left: '85%',
          }}
        />
        <Card
          title={
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <span>{`${detail?.realName} 會員資料表`}</span>
              <Space>
                <Button
                  icon={<PrinterFilled />}
                  type='link'
                >
                  列印
                </Button>
                <BackBtn />
              </Space>
            </Space>
          }
          styles={{
            body: {
              display: 'flex',
              width: '100%',
              flexDirection: 'column',
              alignItems: 'center',
            },
          }}
        >
          <div className=''>
            <Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={3}>會員資料表</Title>
              <Title level={4}>
                狀態: <VerifyStatusLabel status={detail?.kycVerifyStatus} />
              </Title>
            </Space>

            <Form
              initialValues={{ faileds: [''] }}
              form={form}
              layout='horizontal'
              style={{ minWidth: 500 }}
              onFinish={(value: DetailFormSubmit) => {
                setSubmitDatas(value);
              }}
            >
              <Form.Item
                name='name'
                label='姓名(公司名稱/負責人)'
                rules={[{ required: true, message: '請輸入姓名' }]}
              >
                <Input disabled={!!sendRes} />
              </Form.Item>

              <Form.Item
                name='idNumber'
                label='身分證字號'
                rules={[{ required: true, message: '請輸入身分證字號' }]}
              >
                <Input disabled={!!sendRes} />
              </Form.Item>

              <Form.Item
                name='national'
                label='國籍'
                rules={[{ required: true, message: '請輸入國籍' }]}
              >
                <Input disabled={!!sendRes} />
              </Form.Item>

              <Form.Item
                name='birth'
                label='出生日期'
                rules={[{ required: true, message: '請輸入出生日期' }]}
              >
                <DatePicker disabled={!!sendRes} />
              </Form.Item>

              <Form.Item
                name='phone'
                label='連絡電話'
                rules={[{ required: true, message: '請輸入連絡電話' }]}
              >
                <Input disabled={!!sendRes} />
              </Form.Item>

              <Form.Item
                name='email'
                label='電子信箱'
                rules={[{ required: true, message: '請輸入電子信箱' }]}
              >
                <Input disabled={!!sendRes} />
              </Form.Item>

              <Form.Item
                name='residenceAddress'
                label='戶籍地址'
                rules={[{ required: true, message: '請輸入戶籍地址' }]}
              >
                <Input disabled={!!sendRes} />
              </Form.Item>

              <Form.Item
                name='contactAddress'
                label='聯絡地址'
                rules={[{ required: true, message: '請輸入聯絡地址' }]}
              >
                <Input
                  disabled={!!sendRes}
                  addonAfter={
                    <Checkbox
                      disabled={!!sendRes}
                      onChange={(e) => {
                        if (e.target.checked) {
                          sameAddressTemp.current = form.getFieldValue('contactAddress');
                          form.setFieldValue('contactAddress', form.getFieldValue('residenceAddress'));
                        } else if (!!sameAddressTemp.current) {
                          form.setFieldValue('contactAddress', sameAddressTemp.current);
                        }
                      }}
                    >
                      同戶籍地址
                    </Checkbox>
                  }
                />
              </Form.Item>

              <Form.Item
                label='身分證正反面'
                rules={[{ required: true, message: '請上傳身分證正反面' }]}
              >
                <MutiImageField
                  maxSize={2}
                  isPending={!!sendRes}
                  names={['ID_Front', 'ID_Back']}
                  userId={location.state.id}
                  preViews={[frontImg, backImg]}
                />
              </Form.Item>

              <Form.Item
                label='手持證件照 (櫃台人員協助)'
                rules={[{ required: true, message: '請上傳手持證件照' }]}
              >
                <MutiImageField
                  maxSize={1}
                  isPending={!!sendRes}
                  names={['ID_Holder']}
                  userId={location.state.id}
                  preViews={[holdImg]}
                />
              </Form.Item>

              <div style={{ paddingInline: 15 }}>
                <Divider className='tight' />
              </div>
              <Title level={3}>審核結果</Title>

              {/* 審核結果 */}
              <Form.Item
                name='status'
                rules={[
                  {
                    required: !!detail,
                    message: '請選擇審核結果',
                  },
                ]}
              >
                <Radio.Group
                  disabled={!!sendRes}
                  options={verifyStatusOptions.filter((option) => option.value !== VerifyStatusNum.Verifing)}
                  onChange={(e) => setVerifyStatus(e.target.value)}
                />
              </Form.Item>

              {verifyStatus === VerifyStatusNum.Fail && (
                <Form.List name='faileds'>
                  {(fields, { add, remove }) => {
                    return (
                      <>
                        <Title level={4}>選擇未通過欄位</Title>
                        {fields.map((field, index) => (
                          <Form.Item
                            style={{ width: '100%' }}
                            {...field}
                          >
                            <AntSelect
                              disabled={!!sendRes}
                              options={kycFieldOptions}
                              onChange={() => {
                                const currentFaileds = form.getFieldValue('faileds') as Array<string>;
                                const valueFaileds = currentFaileds.filter((failed) => !!failed);
                                if (valueFaileds.length === fields.length) add('');
                              }}
                              popupMatchSelectWidth={200}
                              placeholder={<>請選擇欄位名稱</>}
                              containProps={{
                                className: 'test',
                              }}
                              onDelete={fields.length !== 0 ? () => remove(index) : undefined}
                            />
                          </Form.Item>
                        ))}
                      </>
                    );
                  }}
                </Form.List>
              )}

              <Form.Item className='tight'>
                <Button
                  loading={!!sendRes}
                  type='primary'
                  htmlType='submit'
                  style={{ width: '100%' }}
                >
                  送出
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Card>

        <VerifyCodeModal
          open={!!submitDatas}
          onCancel={() => setSubmitDatas(undefined)}
          onOk={() => {
            if (submitDatas) handleTrans(submitDatas);
          }}
          isLoading={sending}
        />
      </>
    );
  }

  // 處理 loading;
  return (
    <>
      <Card
        title={<Skeleton.Input active />}
        styles={{
          body: {
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            alignItems: 'center',
          },
        }}
      >
        <div style={{ minWidth: 500 }}>
          <Skeleton.Input
            size='large'
            active
          />
          <Divider />
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </div>
      </Card>
    </>
  );
};

export default DetailPage;
