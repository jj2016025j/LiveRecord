import { UseTestMutationProps, useTestMutation } from '@/utils';
import { axiosRoot } from '@/utils/axiosRoot';
import { useState } from 'react';

type ManualBlockchainConfirmRes = {
};
type ManualBlockchainConfirmProps = {
  id: string | undefined
  status: Array<any>
};
type OtherProps = {};

const useUpdateListStatus = (useProps: UseTestMutationProps<ManualBlockchainConfirmRes, ManualBlockchainConfirmProps, OtherProps>) => {
  const { ...other } = useProps;
  const [successOrFail, setSuccessOrFail] = useState(false)
  const testMutation = useTestMutation<ManualBlockchainConfirmRes, ManualBlockchainConfirmProps>({
    ...other,
    mutationFn: (props) => {
      const request = axiosRoot.put('/updateliststatus', props).then(({ data }) => data);
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

export { useUpdateListStatus };
export type { ManualBlockchainConfirmRes, ManualBlockchainConfirmProps };
