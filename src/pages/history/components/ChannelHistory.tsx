import TableAlpha from '@/components/TableAlpha';
import { HistoryPageInit } from '../useHxStatus';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { ChannelOptions, useQueryChannelList } from '@/api';
import useChannelColumns from './useChannelColumns';

interface IChannelHistoryProps extends HistoryPageInit { }

const ChannelHistory: React.FunctionComponent<IChannelHistoryProps> = (props) => {
  const { columns } = useChannelColumns();
  const [showHistory, setShowHistory] = useState<ChannelOptions[]>()
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  // DOM
  const { ...hxState } = props || {};
  const { dateFrom, dateTo, searchInput } = hxState || {};
  // mutate
  const {
    mutate: query,
    data,
    isPending,
  } = useQueryChannelList({
    // isTest: true,
  });
  // console.log('data', data)

  useEffect(() => {
    if (!dateFrom || !dayjs(dateFrom).isValid() || !dateTo || !dayjs(dateTo).isValid()) return;
    query({
      // dateFrom: dateFrom.format(),
      // dateTo: dateTo.format(),
      pageSize: pageSize,
      currentPage: page,
    });
  }, [dateFrom, dateTo, searchInput, pageSize, page]);

  useEffect(() => {
    // const showHistory = searchInput ?
    //   data?.reservations.filter((record) => {
    //     return record.name.includes(searchInput)
    //       || record.url.includes(searchInput)
    //   }) : data?.reservations || [];
    const showHistory = data?.channelList || [];
    setShowHistory(showHistory)
    console.log('data', data)
    console.log('showHistory', showHistory)
  }, [data])

  return (
    <>
      <TableAlpha
        {...{ totalCount: data?.totalCount, setPageSize, setPage }}
        loading={isPending}
        rowKey='id'
        columns={columns}
        dataSource={showHistory}
      />
    </>
  );
};

export default ChannelHistory;
