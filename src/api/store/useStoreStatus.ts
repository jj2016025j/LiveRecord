import { useEffect, useState } from 'react';
import { useUserStore } from '../../store';
import { myFactory, useTestQuery, UseTestQueryProps } from '../../utils';
import { axiosRoot } from '../../utils/axiosRoot';
import { RoleTypes } from '../useLogin';

// types
type CounterOptions = {
  cash: number;
};

type StoreStatusOptions = {
  userId: string;
  userName: string;
  storeName: string;
  storeLocation: string;
  roles: Array<RoleTypes>;
} & {
  counters: Array<CounterOptions>;
};
type StoreStatusProps = {};

type OtherProps = {};

const useStoreStatus = ({ ...useProps }: UseTestQueryProps<OtherProps, StoreStatusProps>) => {
  const { enabled, ...config } = useProps;
  const [debounceEnabled, setDebounceEnabled] = useState(false);
  const { setStoreStatus, store } = useUserStore();

  useEffect(() => {
    if (enabled) setTimeout(() => setDebounceEnabled(true), 0);
    else setDebounceEnabled(false);
  }, [enabled]);


  const testQuery = useTestQuery<StoreStatusOptions, StoreStatusProps>({
    ...config,
    enabled: debounceEnabled,
    queryKey: ['store', 'status'],
    qf: () => {
      const request = axiosRoot.get('/').then(({ data }) => data);
      return request;
    },
    onSuccess: (res) => {
      setStoreStatus({
        ...res,
        counters: Array(3)
          .fill(null)
          .map(() => ({ cash: myFactory.number.int({ max: 10000, min: 1000 }) })),
      });
    },
    blockNotify: !store, // 再第一次就請求失敗時，表示為使用者閒置過久後使用監聽器過期的token請求的情況
    refetchInterval: 1000 * 60 * 10,
    skipLog: true,
    onTest: () => {
      const makeData: StoreStatusOptions = {
        userId: '8b32f554-d352-481c-85d0-3042d253937b',
        userName: 'store',
        storeName: '逢甲店',
        storeLocation: '台中',
        roles: ['Store'],
        counters: [],
      };
      return Promise.resolve(makeData);
    },
  });

  return testQuery;
};

export { useStoreStatus };
export type { StoreStatusOptions, StoreStatusProps };
