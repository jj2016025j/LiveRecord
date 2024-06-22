import TableAlpha from '../../../components/TableAlpha';
import { useCounterHistory } from '../../../api';
import { useEffect } from 'react';
import { useCounterAmountColumns } from './useCounterAmountColumns';
import { CounterTabKeys } from '@/utils';
import { HistoryPageInit } from '../useHxStatus';

interface CounterAmountTableProps {
  counterTab: CounterTabKeys;
}
export const CounterAmountTable: React.FunctionComponent<HistoryPageInit & CounterAmountTableProps> = (props) => {
  const { columns } = useCounterAmountColumns({});
  // DOM
  const { counterTab, ...hxState } = props || {};
  const { dateFrom, dateTo, searchInput } = hxState;

  // mutation
  const { data, mutate: getHistory, isPending } = useCounterHistory({ isTest: true });
  const showData = data?.history
    ? data.history.filter((record) => {
        const handleDate = () => {
          if (!dateFrom || !dateTo) return false;
          if (dateFrom.isSame(record.date) || dateTo.isSame(record.date)) return true;
          return dateFrom.isBefore(record.date) && dateTo.isAfter(record.date);
        };
        return handleDate() && record.serialNum.includes(searchInput);
      })
    : [];

  // init
  useEffect(() => {
    if (counterTab !== CounterTabKeys.Cash || !dateFrom || !dateTo) return;
    getHistory({
      dateFrom: dateFrom.format(),
      dateTo: dateFrom.format(),
    });
  }, [counterTab, dateFrom, dateTo]);
  return (
    <TableAlpha
      rowKey='id'
      loading={isPending}
      columns={columns}
      dataSource={showData}
    />
  );
};
