import { UseTestQueryProps, useTestQuery } from '@/utils';
import { axiosRoot } from '@/utils/axiosRoot';

type CustomerOptions = {
  userId: string;
  userName: string;
  phoneNumber: string;
};

type CustomerListRes = Array<CustomerOptions>;
type CustomerListProps = {};
type OtherProps = {};

const useCustomerList = (useProps: UseTestQueryProps<OtherProps, CustomerListRes>) => {
  const { ...other } = useProps;

  const testQuery = useTestQuery<CustomerListRes, CustomerListProps>({
    ...other,
    queryKey: ['customer', 'list'],
    qf: () => {
      const request = axiosRoot.get('/store/customerList').then(({ data }) => data);
      return request;
    },
  });

  return { ...testQuery };
};

export { useCustomerList };
export type { CustomerListRes, CustomerOptions, CustomerListProps };
