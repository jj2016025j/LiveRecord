import { Header, Content } from 'antd/es/layout/layout';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { HeaderItems } from '@/components/HeaderItems';
import TestModal from '@/components/TestModal';
import { useUserStore } from '@/store';
import { Layout } from 'antd';
import { useTradeSignal } from '@/hooks';
import styles from './styles.module.scss';

const ProtectedLayout: React.FunctionComponent = () => {
  useTradeSignal({});
  // DOM
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD dddd HH:mm:ss'));

  // query
  const {  setLoginProps } = useUserStore();

  // === init ===
  useEffect(() => {
    // 小時鐘
    const setDateInterval = setInterval(() => {
      setDate(dayjs().format('YYYY-MM-DD dddd HH:mm:ss '));
    }, 1000);

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
