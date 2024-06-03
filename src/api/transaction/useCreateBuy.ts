import { CryptoTypes, TradeStatusNum, TradeTypeNum, useTestMutation, UseTestMutationProps } from '../../utils';
import { axiosRoot } from '../../utils/axiosRoot';

type CreateBuyProps = {
  customerId: string;
  customerWallet: string;
  cryptoAmount: number;
  cryptoType: CryptoTypes;
};

type CreateBuyRes = {
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
  setOpenVerifyCodeModal: React.Dispatch<React.SetStateAction<boolean>>;
  onCancelForm: () => void;
};

const useCreateBuy = (useProps: UseTestMutationProps<CreateBuyRes, CreateBuyProps, OtherProps>) => {
  const { onCancelForm, setOpenVerifyCodeModal, ...other } = useProps;

  const testMutation = useTestMutation<CreateBuyRes, CreateBuyProps>({
    ...other,
    mutationFn: (props) => {
      console.log(props)
      const request = axiosRoot
        .post('/transaction/createBuy', {
          ...props,
          cryptoAmount: props.cryptoAmount.toString(),
        })
        .then(({ data }) => data);
      return request;
    },
    onSuccess: () => {
      onCancelForm();
    },
    onSettled: () => {
      setOpenVerifyCodeModal(false);
    },
    delay: 1000,
  });

  return testMutation;
};

export { useCreateBuy };
export type { CreateBuyRes, CreateBuyProps };
