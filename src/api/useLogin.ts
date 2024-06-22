
import { useUserStore } from '../store';
import { useTestMutation, UseTestMutationProps } from '../utils';
import { axiosRoot } from '../utils/axiosRoot';

type RoleTypes = 'Customer' | 'Officer' | 'Store';

type LoginRes = {
  id: string;
  userName: string; // 使用者手機
  token: string;
  roles: Array<RoleTypes>;
  qrCode: string | null;
};

type LoginProps = {
  userName: string;
  password: string;
  cashRegisterUid: string;
};

const useLogin = ({ ...useProps }: UseTestMutationProps<LoginRes, LoginProps>) => {
  const { setAuth, setLoginProps } = useUserStore();

  const testMutation = useTestMutation<LoginRes, LoginProps>({
    ...useProps,
    mutationFn: (props) => {
      const request = axiosRoot.post('/auth/storeLogin', props).then(({ data }) => data);
      return request;
    },
    onMutate: (props) => {
      setLoginProps(props);
    },
    onSuccess: (data) => {
      setAuth(data);
    },
    onError: () => {
      setLoginProps(null);
    },
    delay: 1000,
    onTest: (params) => {
      const makeData: LoginRes = {
        id: 'Test id',
        userName: params.userName,
        token: 'Test token',
        roles: ['Officer'],
        qrCode: null,
      };
      return Promise.resolve(makeData);
    },
  });

  return testMutation;
};

export { useLogin };
export type { RoleTypes, LoginRes, LoginProps };
