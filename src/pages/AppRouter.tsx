import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { lazy, useEffect, useRef, useState } from 'react';
import StaticLeader from '../components/StaticLeader';
import { LoginRes, useStoreStatus } from '../api';
import { useUserStore } from '@/store';
import { forage, forageKeys } from '../utils/foragePkg';
import FallbackLoading from '../components/fallbackLoading';

const PublicLayout = lazy(() => import('./layouts/PublicLayout'));
const ProtectedLayout = lazy(() => import('./layouts/ProtectedLayout'));
const LoginPage = lazy(() => import('../pages/login/LoginPage'));
const Dashboard = lazy(() => import('../pages/dashboard/DashboardPage'));
const MemberPage = lazy(() => import('../pages/member/MemberPage'));
const MemberDetail = lazy(() => import('../pages/member/detail/DetailPage'));
const ShiftPage = lazy(() => import('../pages/shift/ShiftPage'));
const HistoryPage = lazy(() => import('../pages/history/HistoryPage'));
const ChatPage = lazy(() => import('../pages/chat/ChatPage'));

const NotFound = lazy(() => import('../pages/NotFound'));

// const SettingPage = lazy(() => import('../pages/Setting/SettingPage'));

const ProviteRoutes = () => {
  return (
    <Routes>

      {/* Redirect */}
      <Route index element={<Navigate to="/public" />} />
      {/* pages */}
      <Route
        path='protected'
        element={<ProtectedLayout />}
      >
        <Route
          index
          element={<Dashboard />}
        />
        {/* member detail 與 index 同級所以不做巢狀注意將detail的查詢優先index */}
        <Route
          path='member/detail'
          element={<MemberDetail />}
        />
        <Route
          path='member'
          element={<MemberPage />}
        />
        <Route
          path='shift'
          element={<ShiftPage />}
        />
        <Route
          path='history'
          element={<HistoryPage />}
        />

        <Route
          path='chat'
          element={<ChatPage />}
        />

        {/* <Route
                  path='setting'
                  element={<SettingPage />}
                /> */}
        <Route
          path='*'
          element={
            <StaticLeader
              isReplace
              title='Protected: *'
            />
          }
        />
      </Route>
      {/* 進入主頁: 清除history */}
      <Route
        path='public/*'
        element={
          <StaticLeader
            kickToUrl='/protected'
            title='Protected: public/*'
          />
        }
      />
      {/* error 404 */}
      <Route
        path='*'
        element={<NotFound />}
      />
    </Routes>
  );
};

const PublicRoutes = () => {
  return (
    <Routes>
      {/* Redirect */}
      <Route index element={<Navigate to="/public" />} />
      {/* pages */}
      <Route
        path='public'
        element={<PublicLayout />}
      >
        <Route
          index
          element={<LoginPage />}
        />
        <Route
          path='*'
          element={<Navigate to='/public' />}
        />
      </Route>

      {/* 踢除: 清除history */}
      <Route
        path='protected/*'
        element={
          <StaticLeader
            kickToUrl='/public'
            isReplace
            title='Public: protected/*'
          />
        }
      />
      <Route
        path='*'
        element={<NotFound />}
      />
    </Routes>
  );
};

const LoadingRoutes = () => {
  return (
    <Routes>
      <Route
        path='*'
        element={<FallbackLoading />}
      />
    </Routes>
  );
};

type RoutesStatus = 'loading' | 'public' | 'protected';
type AppRoutesProps = {
  status: RoutesStatus;
};
const AppRoutes = (props: AppRoutesProps) => {
  const { status } = props || {};
  if (status === 'protected') return <ProviteRoutes />;
  if (status === 'public') return <PublicRoutes />;

  return <LoadingRoutes />;
};

const AppRouter = () => {
  const [routerStatus, setRouterStatus] = useState<RoutesStatus>('loading');
  // Store
  const { auth, setAuth, store } = useUserStore();
  useStoreStatus({ enabled: !!auth, isTest: true });
  // console.log('useUserStore', { auth, store })

  // 手作 Debounce 避免router狀態切換過快
  const routerAntiShaker = useRef<NodeJS.Timeout>();
  useEffect(() => {
    if (routerAntiShaker.current) clearTimeout(routerAntiShaker.current);
    routerAntiShaker.current = setTimeout(() => {
      // console.log('public', !auth, !store)
      // console.log('protected', !!auth)

      if (!auth && !store) setRouterStatus('public');
      else if (!!auth) setRouterStatus('protected');
      else setRouterStatus('loading');
    }, 200);
  }, [store, auth]);

  // Auth forage init
  useEffect(() => {
    forage().getItem<LoginRes>(forageKeys.auth, (_, value) => {
      if (value) setAuth(value);
    });
  }, []);

  return (
    <>
      <HashRouter>
        <Routes>
          <Route
            path='/*'
            element={<AppRoutes status={routerStatus} />}
          />
        </Routes>
      </HashRouter>
    </>
  );
};

export default AppRouter;
