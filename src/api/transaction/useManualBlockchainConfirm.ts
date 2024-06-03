import { UseTestMutationProps, useTestMutation } from '@/utils';
import { axiosRoot } from '@/utils/axiosRoot';
import { useState } from 'react';

type ManualBlockchainConfirmRes = {
};
type ManualBlockchainConfirmProps = {
  hash: string
};
type OtherProps = {};

const useManualBlockchainConfirm = (useProps: UseTestMutationProps<ManualBlockchainConfirmRes, ManualBlockchainConfirmProps, OtherProps>) => {
  const { ...other } = useProps;
  const [successOrFail, setSuccessOrFail] = useState(false)
  const testMutation = useTestMutation<ManualBlockchainConfirmRes, ManualBlockchainConfirmProps>({
    ...other,
    mutationFn: (props) => {
      const request = axiosRoot.post('/transaction/manualBlockchainConfirm', props).then(({ data }) => data);
      return request;
    },
    onSuccess: () => {
      setSuccessOrFail(true)
    },
    onError: () => {
      setSuccessOrFail(false)
    }
  });

  return { ...testMutation, successOrFail };
};

export { useManualBlockchainConfirm };
export type { ManualBlockchainConfirmRes, ManualBlockchainConfirmProps };
