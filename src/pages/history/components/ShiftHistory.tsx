import { useShiftHistory } from '../../../api';
import { useShiftColumns } from './useShiftColumns';
import { useEffect } from 'react';
import TableAlpha from '../../../components/TableAlpha';
import { CounterTabKeys } from '@/utils';
import { HistoryPageInit } from '../useHxStatus';

interface ShiftHistoryProps {
  counterTab: CounterTabKeys;
}
const ShiftHistory: React.FunctionComponent<HistoryPageInit & ShiftHistoryProps> = (props) => {
  const { counterTab, dateFrom, dateTo, searchInput } = props || {};
  const { columns } = useShiftColumns({});
  // mutation
  const { data, mutate: getHistory, isPending } = useShiftHistory({ isTest: true });
  const showHistory = data?.history
    ? data.history.filter((record) => {
        const handleDate = () => {
          if (!dateFrom || !dateTo) return false;
          if (dateFrom.isSame(record.date) || dateTo.isSame(record.date)) return true;
          return dateFrom.isBefore(record.date) && dateTo.isAfter(record.date);
        };
        return handleDate() && (record.staff.includes(searchInput) || record.store.includes(searchInput));
      })
    : [];

  // init
  useEffect(() => {
    if (!dateFrom || !dateTo || counterTab !== CounterTabKeys.Shift) return;
    getHistory({
      dateFrom: dateFrom.format(),
      dateTo: dateTo.format(),
    });
  }, []);
  return (
    <TableAlpha
      loading={isPending}
      columns={columns}
      dataSource={showHistory}
    />
  );
};

export default ShiftHistory;
