import { Header, Content } from 'antd/es/layout/layout';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { HeaderItems } from '@/components/HeaderItems';
import { I18n } from '@/components/I18n';
import TestModal from '@/components/TestModal';
import { useUserStore } from '@/store';
import { forage, forageKeys } from '@/utils';
import { Layout, Space, Button, Switch, Typography } from 'antd';
import { useTradeSignal } from '@/hooks';
import { LoginProps, useLogout, useRates } from '@/api';
import styles from './styles.module.scss';

const { Text } = Typography;
const ProtectedLayout: React.FunctionComponent = () => {
  useTradeSignal({});
  // DOM
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD dddd HH:mm:ss'));

  // query
  const { store, loginProps, setLoginProps } = useUserStore();
  const workSpaces = store?.workSpaces;
  useRates({ isTest: false });
  const { logout } = useLogout();

  // === init ===
  useEffect(() => {
    // 小時鐘
    const setDateInterval = setInterval(() => {
      setDate(dayjs().format('YYYY-MM-DD dddd HH:mm:ss '));
    }, 1000);

    // store 還原
    forage().getItem<LoginProps>(forageKeys.loginProps, (_, value) => {
      if (value) setLoginProps(value);
    });

    return () => {
      clearInterval(setDateInterval);
    };
  }, [setLoginProps]);

  return (
    <>
      <Layout className={styles.layout}>
        {/* Header */}
        <Header className={styles.header}>
          <div className={styles['box-nav']}>
            <HeaderItems />
            <Space size='large'>
              <div>{workSpaces?.storeLocation + workSpaces?.storeName} 櫃台{(workSpaces?.storeId)?.toString().padStart(2, '0')} </div>
              <div>登入人員: {loginProps?.userName}</div>
              <Button
                ghost
                size='small'
                onClick={() => logout()}
              >
                登出
              </Button>
              <I18n />
            </Space>
          </div>
          <div className={styles['box-tools']}>
            <div>
              <Space>
                <Text type='secondary'>訂單可完成提示音</Text>
                <Switch
                  checkedChildren='開啟'
                  unCheckedChildren='關閉'
                  defaultChecked
                />
              </Space>
            </div>
            <div>{date}</div>
          </div>
        </Header>

        {/* Content */}
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>

      {/* test */}
      <TestModal isTest={false} />
    </>
  );
};

export default ProtectedLayout;
