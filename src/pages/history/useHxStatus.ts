/**
 * 這個Hook用於管理History下的狀態，使用useReducer
 */

import dayjs, { Dayjs } from "dayjs";
import { useReducer } from "react";

// === init ===
 type HistoryPageInit = {
  dateFrom: Dayjs | null;
  dateTo: Dayjs | null;
  searchInput: string;
};
//  === Reducer ===
type ReducerProps = {
  setDateFrom?: Dayjs | null;
  setDateTo?: Dayjs | null;
  setSearchInput?: string;
}
type HistoryPageReducer = (origin: HistoryPageInit, props: ReducerProps) => HistoryPageInit;

// === hook ===
const useHxStatus = () => {
	const reducer = useReducer<HistoryPageReducer, HistoryPageInit>(
    (
      origin,
      // prettier-ignore
      { setDateFrom, setDateTo, setSearchInput },
    ) => {
      if (setDateFrom !== undefined) origin.dateFrom = setDateFrom;
      if (setDateTo !== undefined) origin.dateTo = setDateTo;
      if (setSearchInput !== undefined) origin.searchInput = setSearchInput;
      return { ...origin };
    },
    {
      dateFrom: null,
      dateTo: null,
      searchInput: '',
    },
    (init) => {
      return {
        ...init,
        dateFrom: dayjs().startOf('day').set('day', 1),
        dateTo: dayjs().startOf('day').set('day', 1).add(1, 'week'),
      };
    },
	);

	return reducer;
}

export { useHxStatus };
export type {HistoryPageInit, HistoryPageReducer}