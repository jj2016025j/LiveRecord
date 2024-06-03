import { Dayjs } from 'dayjs';
import { useRef, useState } from 'react';
import {
  TradeTypeNum,
  useTestMutation,
  UseTestMutationProps,
} from '../../utils';
import logo from '@/assets/eth.png'
import { axiosRoot } from '@/utils/axiosRoot';

// types
type ChannelOptions = {
  id?: string;
  previewImage: string;
  name: string;
  url: string;
  status: TradeTypeNum;
  size: number[];
  viewers: number
  autoRecord: boolean,
  isfavorite: boolean,
  Viewed: boolean
};

type ChannelListRes = Array<ChannelOptions>;

type ChannelListProps = {
  dateFrom?: string;
  dateTo?: string;
  totalCount?: number;
  currentPage?: number;
};

type OtherProps = {
  setIsSeekMore?: React.Dispatch<React.SetStateAction<boolean>>;
};

const useQueryChannelList = (useProps: UseTestMutationProps<ChannelListRes, ChannelListProps, OtherProps>) => {
  const { setIsSeekMore, ...config } = useProps;
  const [reservations, setChannelList] = useState<Array<ChannelOptions>>([]);
  const [queryDate, setQueryDate] = useState<Dayjs>();
  const tempRs = useRef<Array<ChannelOptions>>([]);
  // store

  const testMutation = useTestMutation<ChannelListRes, ChannelListProps>({
    ...config,
    mutationFn: (props) => {
      const request = axiosRoot.get('getlist')
        .then(({ data }) => {
          return data
        });
      return request;
    },
    onTest: (props) => {
      const reservations = new Array(props.totalCount ?? 5).fill(null).map(() => {
        const makeData: ChannelOptions = {
          name: '陳家洛',
          url: 'https://chatgpt.com/c/86659176-8e10-4c42-aa11-7ce5d7a01fe5https://chatgpt.com/c/86659176-8e10-4c42-aa11-7ce5d7a01fe5',
          previewImage: logo,
          status: TradeTypeNum.CustomerBuy,
          size: [720, 1080],
          viewers: 1000,
          autoRecord: true,
          isfavorite: true,
          Viewed: false,
        };
        // console.log('makeData', makeData)
        return makeData;
      });
      return Promise.resolve(reservations);
    },
  });

  return { ...testMutation, reservations, setChannelList };
};

export { useQueryChannelList };
export type { ChannelOptions, ChannelListRes, ChannelListProps };
