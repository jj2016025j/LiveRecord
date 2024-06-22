import { Tabs, TabsProps } from 'antd';
import { CounterAmountTable } from './CounterAmountTable';
import { TxTable } from './TxTable';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CounterTabKeys } from '@/utils';
import { HistoryPageInit } from '../useHxStatus';
import ShiftHistory from './ShiftHistory';

interface TabProps {}
export const CounterTabs: React.FunctionComponent<TabProps & HistoryPageInit> = (props) => {
  const { ...hxState } = props;
  const location = useLocation();
  const navigator = useNavigate();
  // DOM
  const [counterTab, setCounterTab] = useState<CounterTabKeys>(
    process.env.NODE_ENV === 'development' ? CounterTabKeys.Cash : CounterTabKeys.Cash,
  );
  // init
  useEffect(() => {
    console.log(location.state?.counterTab, Object.values(CounterTabKeys).includes(location.state?.counterTab));

    if (Object.values(CounterTabKeys).includes(location.state?.counterTab)) {
      setCounterTab(location.state.counterTab);
    }
  }, [location.state]);

  //
  const items: TabsProps['items'] = [
    {
      key: CounterTabKeys.Cash,
      label: '櫃台金額',
      children: <CounterAmountTable {...{ ...hxState, counterTab }} />,
    },
    {
      key: CounterTabKeys.Trade,
      label: '交易紀錄',
      children: <TxTable {...{ ...hxState, counterTab }} />,
    },
    {
      key: CounterTabKeys.Shift,
      label: '交班',
      children: <ShiftHistory {...{ ...hxState, counterTab }} />,
    },
  ];
  return (
    <>
      <Tabs
        onChange={(newKey) => {
          setCounterTab(newKey as CounterTabKeys);
          navigator('.');
        }}
        activeKey={counterTab}
        tabBarStyle={{ paddingInline: 15 }}
        items={items}
      />
    </>
  );
};
