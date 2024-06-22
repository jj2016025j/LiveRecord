import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { lazy } from 'react';
import StaticLeader from '../components/StaticLeader';

const ProtectedLayout = lazy(() => import('./layouts/ProtectedLayout'));
const Dashboard = lazy(() => import('../pages/dashboard/DashboardPage'));
const HistoryPage = lazy(() => import('./dashboard/LiveList'));

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
        <Route
          path='history'
          element={<HistoryPage />}
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
