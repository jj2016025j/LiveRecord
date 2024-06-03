/**
 * 這個組件作用於路由的路口，用於測試當進入路由時檢查網頁的狀態
 */

import { Button, Divider, Typography } from 'antd';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store';
import FallbackLoading from './fallbackLoading';

interface IStaticLeaderProps {
  kickToUrl?: string;
  title?: string;
  isReplace?: boolean;
}

const { Title, Text } = Typography;
const isTest = true;
const StaticLeader: React.FunctionComponent<IStaticLeaderProps> = (props) => {
  const navigator = useNavigate();
  const { kickToUrl, title, isReplace } = props || {};
  const { auth } = useUserStore();
  useEffect(() => {
    if (!navigator || !kickToUrl) return;
    if (kickToUrl) navigator(kickToUrl, { replace: isReplace });
  }, [kickToUrl, navigator, isReplace]);
  if (isTest && import.meta.env.DEV) {
    const isBlock = useRef(false);
    // DOM
    const location = useLocation();

    useEffect(() => {
      const itemKey = 'visiteLeaderTimes' + window.location.hash;
      const visiteTimes = localStorage.getItem(itemKey);
      if (visiteTimes && Number(visiteTimes) > 5) {
        console.warn('Statis leader over visited !!');
        isBlock.current = true;
        return;
      }
      return () => {
        if (!visiteTimes) localStorage.setItem(itemKey, '1');
        else {
          let timesValue = Number(visiteTimes);
          const newValue = timesValue + 1;
          localStorage.setItem(itemKey, newValue.toString());
        }
        setTimeout(() => {
          if (process.env.NODE_ENV === 'development') console.warn('Static leader on remove', itemKey);
          localStorage.removeItem(itemKey);
        }, 1000);
      };
    }, []);

    return (
      <>
        <div
          style={{
            position: 'fixed',
            top: '9%',
            left: '50%',
            transform: 'translate(-50%)',
            width: '100%',
            padding: 15,
          }}
        >
          <Title level={4}>
            <span>This is StaticLeader</span>
            {title && <span style={{ marginLeft: 15 }}>{title}</span>}
          </Title>
          <Divider>Auth</Divider>
          {auth
            ? Object.entries(auth).map(([key, value], index) => {
                return (
                  <div
                    style={{ display: 'flex', alignItems: 'center' }}
                    key={index}
                  >
                    <Title level={3}>key: {key}</Title>
                    <hr />
                    <Text>
                      value: {JSON.stringify(value).slice(0, 100)} {JSON.stringify(value).length > 100 && '...'}
                    </Text>
                  </div>
                );
              })
            : 'No auth'}
          <Divider>Location</Divider>
          {location &&
            Object.entries(location).map(([key, value], index) => {
              return (
                <div
                  style={{ display: 'flex', alignItems: 'center' }}
                  key={index}
                >
                  <Title level={3}>key: {key}</Title>
                  <hr />
                  <span>value: {JSON.stringify(value)}</span>
                </div>
              );
            })}
          <hr />
          <Button onClick={() => navigator('/')}>Home page</Button>
        </div>
      </>
    );
  }
  return <FallbackLoading />;
};

export default StaticLeader;
