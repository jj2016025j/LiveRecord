import { useNavigate } from 'react-router-dom';
import { useTestMutation, UseTestMutationProps, VerifyStatusNum } from '../../utils';
import { axiosRoot } from '../../utils/axiosRoot';
import { DetailFormSubmit } from '@/pages/member/detail/method';

// types
type SendRes = {};
type SendProps = {
  idNumber: string;
  realName: string;
  nationality: string;
  dateOfBirth: string;
  registeredAddress: string;
  contactAddress: string;
  contactPhoneNumber: string;
  email: string;
};
type OtherProps = {
  setSubmitDatas: React.Dispatch<React.SetStateAction<DetailFormSubmit | undefined>>;
};

const useSendKyc = ({ setSubmitDatas, ...useProps }: UseTestMutationProps<SendRes, SendProps, OtherProps>) => {
  const navigator = useNavigate();

  const testMutation = useTestMutation<SendRes, SendProps>({
    ...useProps,
    mutationFn: (props) => {
      const request = axiosRoot.post('/kyc/create', props).then(({ data }) => data);

      return request;
    },
    onSuccess: () => {
      setSubmitDatas(undefined);
      setTimeout(() => {
        navigator('/protected/member', {
          state: { tab: VerifyStatusNum.Pass },
        });
      }, 1000);
    },
    delay: 1000,
    onTest: () => {
      return Promise.resolve({});
    },
  });

  return { ...testMutation };
};

export { useSendKyc };
export type { SendRes, SendProps };
