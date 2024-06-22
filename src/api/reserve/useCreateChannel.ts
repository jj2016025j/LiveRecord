import {
  CryptoTypes,
  TradeAmountRange,
  useTestMutation,
  UseTestMutationProps,
} from "../../utils";

type CreateChannelRes = {};
type CreateChannelProps = {
  id: string;
  cryptoType: CryptoTypes;
  amountLevel: TradeAmountRange;
  date: string;
};
type OtherProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const useCreateChannel = (
  // prettier-ignore
  { setOpen, ...useProps }: UseTestMutationProps<CreateChannelRes, CreateChannelProps, OtherProps>
) => {
  const testMutation = useTestMutation<CreateChannelRes, CreateChannelProps>({
    ...useProps,
    onSuccess: () => {
      setOpen(false);
    },
    delay: 1000,
    onTest: () => {
      return Promise.resolve({});
    },
  });

  return { ...testMutation };
};

export { useCreateChannel };
export type { CreateChannelRes, CreateChannelProps };
