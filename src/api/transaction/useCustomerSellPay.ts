import { useTestMutation, UseTestMutationProps } from "../../utils";
import { CreateBuyRes } from "./useCreateBuy";

// types
type CustomerSellPayRes = CreateBuyRes;

type CustomerSellPayProps = {
  transactionUid: string;
};

type OtherProps = {};

// prettier-ignore
const useCustomerSellPay = ({ ...useProps
}: UseTestMutationProps<CustomerSellPayRes, CustomerSellPayProps, OtherProps>) => {

	const testMutation = useTestMutation<CustomerSellPayRes, CustomerSellPayProps>({
		...useProps,
	});

	return testMutation
}

export { useCustomerSellPay };
export type { CustomerSellPayRes, CustomerSellPayProps };
