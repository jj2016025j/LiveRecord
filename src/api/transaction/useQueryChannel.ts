import { TradeTypeNum, useTestMutation, UseTestMutationProps } from "@/utils";
import { axiosRoot } from "@/utils/axiosRoot";

type QueryChannelRes = {
  id?: string;
  previewImage: string;
  name: string;
  url: string;
  status: TradeTypeNum;
  size: number[];
  viewers: number
  autoRecord: boolean,
  isfavorite: boolean,
  Viewed: boolean,
  LiveUrl: string
};

type QueryChannelProps = {
  urlOrName: string;
};
type OtherProps = {
};

const useQueryChannel = ({
  ...config
}: UseTestMutationProps<QueryChannelRes, QueryChannelProps, OtherProps>) => {
  const testMutation = useTestMutation<QueryChannelRes, QueryChannelProps>({
    ...config,
    mutationFn: (props) => {
      const request = axiosRoot.post("queryandaddlist", {
        params: {
          urlOrName: props.urlOrName
        }
      })
        .then(({ data }) => {
          return data
        });
      return request;
    },
  });

  return testMutation;
};

export { useQueryChannel };
export type { QueryChannelRes, QueryChannelProps };
