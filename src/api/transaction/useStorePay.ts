import { UseTestMutationProps, useTestMutation } from '@/utils';
import { axiosRoot } from '@/utils/axiosRoot';

// 在後台審核完畢後Store用來告知後端已經付款給Member
type StorePayRes = {};
type StorePayProps = { transactionId: string };
type OtherProps = {};

const useStorePay = (useProps: UseTestMutationProps<StorePayRes, StorePayProps, OtherProps>) => {
  const { ...other } = useProps;

  const testMutation = useTestMutation<StorePayRes, StorePayProps>({
    ...other,
    mutationFn: (props) => {
      const request = axiosRoot.post('/transaction/transferred', props).then(({ data }) => data);
      return request;
    },
  });

  return { ...testMutation };
};

export { useStorePay };
export type { StorePayRes, StorePayProps };
