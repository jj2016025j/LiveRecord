import { Card, Space, DatePicker, Input, Tabs, TabsProps, Button } from 'antd';
import { useHxStatus } from '../history/useHxStatus';
import ChannelHistory from './ChannelHistory';
import { useDeleteChannels } from '@/api/transaction/useDeleteChannels';
const { RangePicker } = DatePicker;

interface IHistoryPageProps {
  setLiveUrl: any
}
const LiveList: React.FunctionComponent<IHistoryPageProps> = (props) => {
  const { setLiveUrl } = props;
  const [state, dispatch] = useHxStatus();
  const { dateFrom, dateTo, searchInput } = state;
  const { mutate: deleteChannels } = useDeleteChannels();
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '櫃台紀錄',
      children: <ChannelHistory {...state} setLiveUrl={setLiveUrl} />,
    },
  ];

  return (
    <>
      <Card
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <Tabs
          tabBarStyle={{ paddingInline: 15 }}
          defaultActiveKey={import.meta.env.DEV ? '2' : '1'}
          items={items}
          tabBarExtraContent={
            <Space>
              <Button
                loading={false}
                type='text'
                htmlType='submit'
                onClick={() => { deleteChannels({ id: '' }) }}
              >
                刪除
              </Button>
              <Input
                value={searchInput}
                onChange={(e) => dispatch({ setSearchInput: e.target.value })}
                placeholder='搜尋直播內容'
              />
              <RangePicker
                value={[dateFrom, dateTo]}
                onChange={(dates) => {
                  const [setDateFrom, setDateTo] = dates || [];
                  dispatch({ setDateFrom, setDateTo });
                }}
              />
            </Space>
          }
        />
      </Card>
    </>
  );
};
export default LiveList;
