import { UseTestMutationProps, useTestMutation } from '@/utils';
import { axiosRoot } from '@/utils/axiosRoot';

type StoreCompleteRes = {};
type StoreCompleteProps = { transactionId: string };
type OtherProps = {};

const useStoreComplete = (useProps: UseTestMutationProps<StoreCompleteRes, StoreCompleteProps, OtherProps>) => {
  const { ...other } = useProps;

  const testMutation = useTestMutation<StoreCompleteRes, StoreCompleteProps>({
    ...other,
    mutationFn: (props) => {
      const request = axiosRoot.post('/transaction/completed', props).then(({ data }) => data);
      return request;
    },
    delay: 1000,
    onTest: () => {
      const makeData: StoreCompleteRes = {};
      return Promise.resolve(makeData);
    },
  });

  return { ...testMutation };
};

export { useStoreComplete };
export type { StoreCompleteRes, StoreCompleteProps };
