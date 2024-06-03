import { TradingOptions, useTradeStore } from '@/store';
import { UseTestQueryProps, useTestQuery } from '@/utils';
import { axiosRoot } from '@/utils/axiosRoot';

// 取得進行中的訂單
type PendingTxsRes = {
  "currentPage": 1,
  "totalPages": 1,
  "pageSize": 10,
  "totalCount": 4,
  "items":Array<TradingOptions>
} ;
type PendingTxProps = {};
type OtherProps = {};

const usePendingTxs = (useProps: UseTestQueryProps<OtherProps, PendingTxProps>) => {
  const { params, ...other } = useProps;
  const { setTransactions } = useTradeStore();

  const testQuery = useTestQuery<PendingTxsRes, PendingTxProps>({
    ...other,
    queryKey: ['store', 'pending'],
    qf: () => {
      const request = axiosRoot.get('/store/myTransList?pageSize=30&pageNumber=1').then(({ data }) => data);
      return request;
    },
    onSuccess: (res) => {
      setTransactions(res.items);
    },
  });

  return { ...testQuery };
};

export { usePendingTxs };
export type { PendingTxsRes, PendingTxProps };
