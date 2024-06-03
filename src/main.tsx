import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ErrorBoundary from 'antd/es/alert/ErrorBoundary';
import FallbackLoading from './components/fallbackLoading';
import { ConfigProvider } from 'antd';
import AppRouter from './pages/AppRouter';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NotifyProvider from './components/NotifyProvider';
import TestAuth from './pages/test/TestAuth';

const App: React.FunctionComponent = () => {
  const queryClient = new QueryClient();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <NotifyProvider />
        <TestAuth {...{ isTest: false }} />

        <Suspense fallback={<FallbackLoading />}>
          <ConfigProvider
            theme={{
              components: {
                Table: {
                  headerBg: '#0a1832',
                  headerColor: 'white',
                  headerBorderRadius: 0,
                  cellPaddingInline: 0,
                  headerSplitColor: 'white',
                  headerSortActiveBg: '#0a1832',
                  headerSortHoverBg: '#0a1832',
                  headerFilterHoverBg: '#0a1832',
                },
              },
              token: { colorPrimary: '#FDA200' },
            }}
          >
            <AppRouter />
          </ConfigProvider>
        </Suspense>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
