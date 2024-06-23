import TableAlpha from '@/components/TableAlpha';
import { HistoryPageInit } from '../history/useHxStatus';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { ChannelOptions, useQueryChannelList } from '@/api';
import useChannelColumns from '../history/components/useChannelColumns';

interface IChannelHistoryProps extends HistoryPageInit { setLiveUrl: any }

const ChannelHistory: React.FunctionComponent<IChannelHistoryProps> = (props) => {
  const { setLiveUrl } = props || {};
  const { columns } = useChannelColumns({setLiveUrl});
  const [showHistory, setShowHistory] = useState<ChannelOptions[]>()
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>();
  const [sorter, setSorter] = useState<Sorter>();

  // DOM
  const { ...hxState } = props || {};
  const { dateFrom, dateTo, searchInput } = hxState || {};
  // mutate
  const {
    mutate: query,
    data,
    isPending,
  } = useQueryChannelList({});
  // console.log('data', data)

  useEffect(() => {
    if (!dateFrom || !dayjs(dateFrom).isValid() || !dateTo || !dayjs(dateTo).isValid()) return;
    query({
      // dateFrom: dateFrom.format(),
      // dateTo: dateTo.format(),
      pageSize: pageSize,
      currentPage: page,
      searchQuery: searchInput,
      filters,
      sorter,
    });
  }, [dateFrom, dateTo, searchInput, pageSize, page, filters, sorter]);

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

  type Filters = {
    auto_record: string[] | null,
    preview_image: string[] | null,
    status: string[] | null,
  }
  type Sorter = {
    field: string | undefined,
    order: string | undefined,
  }

  const handleTableChange = (pagination: any, filters: Filters, sorter: Sorter) => {
    const params = {
      pagination,
      filters,
      sorter,
    };
    const { auto_record, preview_image, status } = filters;
    const { field, order } = sorter;

    // console.log('Sorter field:', field);
    // console.log('Sorter order:', order);

    setFilters({ auto_record, preview_image, status });
    setSorter({ field, order });

    console.log('Table change params:', params);
  };

  return (
    <>
      <TableAlpha
        {...{ totalCount: data?.totalCount, setPageSize, setPage, handleTableChange, setLiveUrl }}
        loading={isPending}
        rowKey='id'
        columns={columns}
        dataSource={showHistory}
      />
    </>
  );
};

export default ChannelHistory;
