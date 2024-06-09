import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { lazy } from 'react';
import StaticLeader from '../components/StaticLeader';

const ProtectedLayout = lazy(() => import('./layouts/ProtectedLayout'));
const Dashboard = lazy(() => import('../pages/dashboard/DashboardPage'));
const MemberPage = lazy(() => import('../pages/member/MemberPage'));
const MemberDetail = lazy(() => import('../pages/member/detail/DetailPage'));
const ShiftPage = lazy(() => import('../pages/shift/ShiftPage'));
const HistoryPage = lazy(() => import('./history/LiveList'));
const ChatPage = lazy(() => import('../pages/chat/ChatPage'));

const NotFound = lazy(() => import('../pages/NotFound'));

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

const AppRouter = () => {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route
            path='/*'
            element={<ProviteRoutes />}
          />
        </Routes>
      </HashRouter>
    </>
  );
};

export default AppRouter;
