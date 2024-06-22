import TableAlpha from '../../../components/TableAlpha';
import { useTxHistory } from '../../../api';
import { useEffect } from 'react';
import { useTxColumns } from './useTxColumns';
import { CounterTabKeys } from '@/utils';
import { HistoryPageInit } from '../useHxStatus';

interface TableProps {
  counterTab: CounterTabKeys;
}

export const TxTable: React.FunctionComponent<TableProps & HistoryPageInit> = (props) => {
  const { columns } = useTxColumns();
  // DOM
  const { counterTab, ...hxState } = props || {};
  const { dateFrom, dateTo, searchInput } = hxState;
  //   mutation
  const { data, mutate: getHistory, isPending } = useTxHistory({ isTest: true });
  const showHistory = data?.history
    ? data.history.filter((record) => {
        const handleDate = () => {
          if (!dateFrom || !dateTo) return false;
          if (dateFrom.isSame(record.completeAt) || dateTo.isSame(record.completeAt)) return true;
          return dateFrom.isBefore(record.completeAt) && dateTo.isAfter(record.completeAt);
        };
        return (
          handleDate() &&
          (record.serialNum.includes(searchInput) ||
            record.orderNum.includes(searchInput) ||
            record.hash.includes(searchInput))
        );
      })
    : [];

  useEffect(() => {
    if (!dateFrom || !dateTo || counterTab !== CounterTabKeys.Trade) return;
    getHistory({
      dateFrom: dateFrom.format(),
      dateTo: dateTo.format(),
    });
  }, [counterTab, dateFrom, dateTo]);

  return (
    <TableAlpha
      loading={isPending}
      rowKey='id'
      columns={columns}
      dataSource={showHistory}
    />
  );
};
