import { Dayjs } from 'dayjs';
import { useRef, useState } from 'react';
import {
  TradeTypeNum,
  useTestMutation,
  UseTestMutationProps,
} from '../../utils';
import { axiosRoot } from '@/utils/axiosRoot';

type Filters = {
  auto_record: string[] | null,
  preview_image: string[] | null,
  status: string[] | null,
}
type Sorter = {
  field: string | undefined,
  order: string | undefined,
}

// types
type ChannelOptions = {
  id?: string;
  // previewImage: string;
  name: string;
  url: string;
  status: TradeTypeNum;
  // size: number[];
  // viewers: number
  auto_record: boolean,
  isFavorite: boolean,
  viewed: boolean,
};

type ChannelListRes = {
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  channelList: Array<ChannelOptions>
};

type ChannelListProps = {
  dateFrom?: string;
  dateTo?: string;
  pageSize?: number;
  currentPage?: number;
  searchQuery: string;
  filters?: Filters;
  sorter?: Sorter;
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
      const request = axiosRoot.post('getlist', props)
        .then(({ data }) => {
          return data
        });
      return request;
    },
    // onTest: (props) => {
    //   const reservations = new Array(props.pageSize ?? 5).fill(null).map(() => {
    //     const makeData: ChannelOptions = {
    //       name: '陳家洛',
    //       url: 'https://chatgpt.com/c/86659176-8e10-4c42-aa11-7ce5d7a01fe5https://chatgpt.com/c/86659176-8e10-4c42-aa11-7ce5d7a01fe5',
    //       previewImage: logo,
    //       status: TradeTypeNum.CustomerBuy,
    //       size: [720, 1080],
    //       viewers: 1000,
    //       auto_record: true,
    //       isFavorite: true,
    //       viewed: false,
    //     };
    //     // console.log('makeData', makeData)
    //     return makeData;
    //   });
    //   return Promise.resolve(reservations);
    // },
  });

  return { ...testMutation, reservations, setChannelList };
};

export { useQueryChannelList };
export type { ChannelOptions, ChannelListRes, ChannelListProps };
