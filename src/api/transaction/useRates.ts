import { useUserStore } from '../../store';
import { useTestQuery, UseTestQueryProps } from '../../utils';
import { axiosRoot } from '../../utils/axiosRoot';

type RateKeyTypes = 'btc' | 'eth' | 'trx' | 'erc20_usdt' | 'trc20_usdt';
type RatesRes = Record<RateKeyTypes, { sell: string; buy: string }>;

type RatesProps = unknown;

const useRates = ({ ...useProps }: UseTestQueryProps) => {
  const { setRates } = useUserStore();

  const testQuery = useTestQuery<RatesRes, unknown, RatesProps>({
    ...useProps,
    queryKey: ['rates'],
    qf: () => {
      const request = axiosRoot.get('/store/cryptoRate').then(({ data }) => data);
      return request;
    },
    onSuccess: (res) => {
      setRates(res);
    },
    skipLog: true,
    refetchInterval: 5 * 1000 * 60,
    refetchIntervalInBackground: false,
  });

  return testQuery;
};

export { useRates };
export type { RateKeyTypes, RatesRes, RatesProps };
