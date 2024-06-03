import { useTestMutation, UseTestMutationProps } from '@/utils';
import { axiosRoot } from '../../utils/axiosRoot';
import { CreateBuyRes } from './useCreateBuy';

// types
type PayCashRes = CreateBuyRes;

type PayCashProps = {
  transactionId: string;
};

type OtherProps = {};

// prettier-ignore
const useCustomerPayCash = (useProps: UseTestMutationProps<PayCashRes, PayCashProps, OtherProps>) => {
	const { ...other } = useProps;

	const testMutation = useTestMutation<PayCashRes, PayCashProps>({
		...other,
		mutationFn: (props) => {
			const request = axiosRoot.post('/transaction/paymentMade', props).then(({ data }) => data);
			return request;
		},
		delay: 1000,
	});

	return testMutation;
};

export { useCustomerPayCash };
export type { PayCashRes, PayCashProps };
