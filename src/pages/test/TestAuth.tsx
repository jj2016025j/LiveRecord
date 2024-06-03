import { LoginRes } from '@/api';
import { forage, forageKeys } from '@/utils';
import { Button } from 'antd';
import { useCallback } from 'react';
import styles from './styles.module.scss';
import { useNotifyStore } from '@/store';

/**
 * 1. 在forage內塞入過期的身分驗證
 */
interface ITestAuthProps {
  isTest: boolean;
}

const TestAuth: React.FunctionComponent<ITestAuthProps> = (props) => {
  const { isTest } = props || {};
  const { pushBSQ } = useNotifyStore();
  if (import.meta.env.DEV && isTest) {
    const handlePushDeadAuth = useCallback(() => {
      const makeAuth: LoginRes = {
        id: '8b32f554-d352-481c-85d0-3042d253937b',
        userName: 'store',
        token: 'test',
        roles: ['Store'],
        qrCode: null,
      };
      forage()
        .setItem<LoginRes>(forageKeys.auth, makeAuth)
        .then((value) => {
          pushBSQ([
            {
              title: 'Test auth',
              des: 'Set auth success' + JSON.stringify(value),
            },
          ]);
        });
    }, []);

    return (
      <>
        <div className={styles['box-masker']}>
          <Button onClick={handlePushDeadAuth}>Forage 過期</Button>
        </div>
      </>
    );
  }

  return <></>;
};

export default TestAuth;
