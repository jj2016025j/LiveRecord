import Link from 'antd/es/typography/Link';
import { Outlet } from 'react-router-dom';
import { I18n } from '@/components/I18n';
import styles from './styles.module.scss';
import logo from '@/assets/APEC_logo_darkUse_單.png';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Layout, Typography } from 'antd';
const { Text } = Typography;
const { Header, Sider } = Layout;
const PublicLayout: React.FunctionComponent = () => {
  const [date, setDate] = useState<string>(dayjs().format('YYYY-MM-DD dddd HH:mm:ss '));
  // init
  useEffect(() => {
    // 時鐘
    const setDateInterval = setInterval(() => {
      setDate(dayjs().format('YYYY-MM-DD dddd HH:mm:ss'));
    }, 1000);

    return () => {
      if (setDateInterval) clearInterval(setDateInterval);
    };
  }, []);

  return (
    <Layout className={styles['layout-grid']}>
      {/* Sider */}
      <Sider className={styles.sider}>
        <Link>
          <img
            alt='logo'
            src={logo}
            width='100%'
          />
        </Link>
        <div className={styles['box-i18n']}>
          <I18n />
        </div>
      </Sider>

      {/* Header */}
      <Header className={styles['header-white']}>
        <Text>{date}</Text>
      </Header>

      {/* Content */}
      <div className={styles['content-grid']}>
        <Outlet />
      </div>
    </Layout>
  );
};

export default PublicLayout;
