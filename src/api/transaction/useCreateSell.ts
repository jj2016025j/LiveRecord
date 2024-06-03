import { CryptoTypes, TradeStatusNum, TradeTypeNum, useTestMutation, UseTestMutationProps } from '../../utils';
import { axiosRoot } from '../../utils/axiosRoot';

type CreateSellProps = {
  customerId: string;
  cryptoAmount: string;
  cryptoType: CryptoTypes;
};

type CreateSellRes = {
  createdAt: string;
  cryptoAmount: string;
  cryptoType: CryptoTypes;
  customerIdNumber: string;
  customerName: string;
  customerWallet: string;
  fiatResult: { quotePrice: string; totalAmount: string; totalFee: string };
  systemWallet: string;
  transactionId: string;
  transactionStatus: TradeStatusNum;
  transactionType: TradeTypeNum;
};

type OtherProps = {
};

const useCreateSell = (useProps: UseTestMutationProps<CreateSellRes, CreateSellProps, OtherProps>) => {
  const {...config} = useProps;
  const testMutation = useTestMutation<CreateSellRes, CreateSellProps>({
    ...config,
    mutationFn: (props) => {
      const request = axiosRoot.post('/transaction/createSell', { ...props }).then(({ data }) => data);
      return request;
    },
    delay: 1000,
  });

  return testMutation;
};

export { useCreateSell };
export type { CreateSellRes, CreateSellProps };
