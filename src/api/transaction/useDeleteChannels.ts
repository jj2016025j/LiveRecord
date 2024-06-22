import { useTestMutation } from '@/utils';
import { axiosRoot } from '@/utils/axiosRoot';

type ManualBlockchainConfirmRes = {
};
type ManualBlockchainConfirmProps = {
  id: string | undefined
};
type OtherProps = {};

const useDeleteChannels = () => {
  const testMutation = useTestMutation<ManualBlockchainConfirmRes, ManualBlockchainConfirmProps>({
    mutationFn: (props) => {
      const request = axiosRoot.put('/deletelist', props).then(({ data }) => data);
      return request;
    },
    onSuccess: () => {
    },
    onError: () => {
    }
  });

  return { ...testMutation };
};

export { useDeleteChannels };
