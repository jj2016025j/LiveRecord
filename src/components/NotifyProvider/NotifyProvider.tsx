import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import useMessage from 'antd/es/message/useMessage';
import { useEffect, useRef } from 'react';
import { useNotifyStore } from '../../store';

interface INotifyProviderProps {}

const successKeepTime = 2 * 1000;
const errorKeepTime = 5 * 1000;
const { Text, Title } = Typography;
const NotifyProvider: React.FunctionComponent<INotifyProviderProps> = () => {
  const { basicSuccessQue, basicErrorQue, shiftBEQ, shiftBSQ } = useNotifyStore();
  const [api, context] = useMessage();

  // 設定 error 的 que;
  const isSendingError = useRef(false);
  useEffect(() => {
    if (basicErrorQue.length < 1 || isSendingError.current) return;
    // 發送並阻擋
    isSendingError.current = true;
    const send = basicErrorQue.at(0);
    api.error({
      duration: errorKeepTime / 1000,
      icon: <span />,
      content: (
        <div style={{ textAlign: 'left' }}>
          <Title
            className='tight'
            level={3}
          >
            <CloseOutlined style={{ color: 'red', marginRight: 5 }} />
            {send?.title}
          </Title>
          <hr />
          <Text>{send?.des}</Text>
        </div>
      ),
    });
    // 特定時間後 取消阻擋 更新successQue
    setTimeout(() => {
      isSendingError.current = false;
      shiftBEQ(1);
    }, errorKeepTime);
  }, [basicErrorQue, shiftBEQ]);

  // 設定 success 的 que;
  const isSendingSuccess = useRef(false);
  useEffect(() => {
    if (basicSuccessQue.length === 0 || isSendingSuccess.current) return;
    // 發送並阻擋
    isSendingSuccess.current = true;
    const send = basicSuccessQue.at(0);
    api.success({
      duration: successKeepTime / 1000,
      icon: <span />,
      content: (
        <div style={{ textAlign: 'left' }}>
          <Title
            className='tight'
            level={3}
          >
            <CheckOutlined style={{ color: 'green', marginRight: 5 }} />
            {send?.title}
          </Title>
          <hr />
          <Text>{send?.des}</Text>
        </div>
      ),
      style: {
        position: 'fixed',
        top: '30%',
        right: '5px',
      },
    });

    // 特定時間後 取消阻擋 更新successQue
    setTimeout(() => {
      isSendingSuccess.current = false;
      shiftBSQ(1);
    }, successKeepTime);
  }, [basicSuccessQue, shiftBEQ]);

  return <>{context}</>;
};

export default NotifyProvider;
