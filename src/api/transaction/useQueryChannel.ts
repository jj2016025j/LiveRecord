import { TradeTypeNum, useTestMutation, UseTestMutationProps } from "@/utils";
import { axiosRoot } from "@/utils/axiosRoot";

type QueryChannelRes = {
  id?: string;
  // previewImage: string;
  name: string;
  url: string;
  status: TradeTypeNum | string;
  // size: number[];
  // viewers: number
  auto_record: boolean,
  isFavorite: boolean,
  viewed: boolean,
  // LiveUrl: string,
  live_stream_url: string,
  preview_image: string,
};

type QueryChannelProps = {
  urlOrNameOrId: string;
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
        urlOrNameOrId: props.urlOrNameOrId
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
