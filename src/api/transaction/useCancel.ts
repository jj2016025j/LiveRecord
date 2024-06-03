import { useTradeStore } from "../../store";
import { useTestMutation, UseTestMutationProps } from "../../utils";
import { axiosRoot } from "../../utils/axiosRoot";

// types
type CancelRes = {
  status: -1,
  transactionId: "5feb4a68-544f-48b8-9458-e4ffb84abbf1",
  type: 1
};

type CancelProps = {
  transactionUid: string;
};

type OtherProps = {};

// mutation
const useCancel = ({
  ...useProps
}: UseTestMutationProps<CancelRes, CancelProps, OtherProps>) => {
  const { removeTransactions } = useTradeStore();

  const mutation = useTestMutation<CancelRes, CancelProps>({
    ...useProps,
    mutationFn: (props) => {
      const request = axiosRoot
        .post("/transaction/cancel", props)
        .then(({ data }) => data);

      return request;
    },
    onSuccess: (res) => {
      removeTransactions([res.transactionId]);
    },
  });

  return mutation;
};

export { useCancel };
export type { CancelRes, CancelProps };
