import { useAdminStore } from '../../store';
import { myFactory, useTestQuery, UseTestQueryProps } from '../../utils';
import { axiosRoot } from '../../utils/axiosRoot';

type TwAccountOptions = {
  id: string;
  accountName: string;
  bankName: string;
  code: string;
  account: string;
};
type CountryAccountsRes = {
  tw: Array<TwAccountOptions>;
  hk: Array<TwAccountOptions>;
};
type OtherProps = {};

const useCountryAccount = ({ ...useProps }: UseTestQueryProps<OtherProps, CountryAccountsRes>) => {
  const { setAllAccounts } = useAdminStore();

  const testQuery = useTestQuery<CountryAccountsRes>({
    ...useProps,
    queryKey: ['country', 'account'],
    qf: () => {
      const request = axiosRoot.get('/admin/accounts').then(({ data }) => data);
      return request;
    },
    onSuccess: (res) => {
      setAllAccounts(res);
    },
    delay: 1000,
    onTest: () => {
      const makeData: CountryAccountsRes = {
        tw: Array(10)
          .fill(null)
          .map(() => {
            const account: TwAccountOptions = {
              id: myFactory.string.uuid(),
              accountName: myFactory.person.firstName(),
              bankName: myFactory.location.street().slice(0, -1) + '銀行',
              code: myFactory.string.alphanumeric({ length: 3 }),
              account: myFactory.string.alphanumeric({ length: 12 }),
            };
            return account;
          }),
        hk: Array(10)
          .fill(null)
          .map(() => {
            const account: TwAccountOptions = {
              id: myFactory.string.uuid(),
              accountName: myFactory.person.firstName(),
              bankName: myFactory.location.street().slice(0, -1) + '銀行',
              code: myFactory.string.alphanumeric({ length: 3 }),
              account: myFactory.string.alphanumeric({ length: 12 }),
            };
            return account;
          }),
      };
      return Promise.resolve(makeData);
    },
  });

  return { ...testQuery };
};

export { useCountryAccount };
export type { TwAccountOptions, CountryAccountsRes };
