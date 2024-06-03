import TableAlpha from '@/components/TableAlpha';
import { HistoryPageInit } from '../useHxStatus';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { ChannelOptions, useQueryChannelList } from '@/api';
import useChannelColumns from './useChannelColumns';

interface IChannelHistoryProps extends HistoryPageInit { }

const ChannelHistory: React.FunctionComponent<IChannelHistoryProps> = (props) => {
  const { columns } = useChannelColumns({});
  const [showHistory, setShowHistory] = useState<ChannelOptions[]>()

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
      dateFrom: dateFrom.format(),
      dateTo: dateTo.format(),
      totalCount: 50,
      currentPage: 1,
    });
  }, [dateFrom, dateTo, searchInput]);

  useEffect(() => {
    // const showHistory = searchInput ?
    //   data?.reservations.filter((record) => {
    //     return record.name.includes(searchInput)
    //       || record.url.includes(searchInput)
    //   }) : data?.reservations || [];
    const showHistory = data || [];
    setShowHistory(showHistory)
    console.log('data', data)
    console.log('showHistory', showHistory)
  }, [data])

  return (
    <>
      <TableAlpha
        columns={columns}
        dataSource={showHistory}
        loading={isPending}
        rowKey={'id'}
      />
    </>
  );
};

export default ChannelHistory;
