import { ReservationOptions, useQueryChannelList } from '../../../api';
import CryptoAvator from './CryptoAvator';
import AmountLevel from './AmountLevel';
import dayjs from 'dayjs';
import { TradeTypeNum, tw } from '../../../utils';
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import LoadingMask from '../../../components/LoadingMask';
import ChannelBadge from './ChannelBadge';
import { Button, Calendar, Card, List, Skeleton, Space, Typography } from 'antd';

interface IChannelsProps { }

const { Title } = Typography;
const Channels: React.FunctionComponent<IChannelsProps> = (props) => {
  const { } = props || {};
  // DOM
  const [isSeekMore, setIsSeekMore] = useState(process.env.NODE_ENV === 'development' ? false : false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [holidays, setHolidays] = useState([]);

  interface Holiday {
    isHoliday: boolean;
    description: string;
    date: string;
    week: string;
  }

  useEffect(() => {
    try {
      fetch('https://cdn.jsdelivr.net/gh/ruyut/TaiwanCalendar/data/2024.json').then((data) => {
        return data.json()
      }).then((data) => {
        const taiwanHolidays = data.filter((day: Holiday) => day.isHoliday)
        setHolidays(taiwanHolidays)
        // console.log("台灣行事曆信息資料", data);
        // console.log("假日信息資料", taiwanHolidays);
      })
    } catch (error) {
      console.log(error);
    }
  }, []);

  // mutation
  const {
    mutate: checkChannel,
    isPending,
    reservations,
    data,
    queryDate,
  } = useQueryChannelList({
    isTest: true,
    setIsSeekMore,
  });
  // //全部資料
  // console.log("reservations", reservations)
  // // 部分資料
  // console.log("data", data)

  // init
  useEffect(() => {
    checkChannel({
      dateFrom: dayjs().startOf('day').format('YYYY-MM-DD'),
      dateTo: dayjs().startOf('day').add(1, 'day').format('YYYY-MM-DD'),
    });
  }, [checkChannel]);

  const dateFullCellRender = (date: { format: (arg0: string) => any; date: () => string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => {
    const currentDate = date.format("YYYYMMDD");
    const today = dayjs().format('YYYYMMDD')
    const isHoliday = holidays.some((holiday: Holiday) => holiday.date === currentDate);
    const isToday = currentDate === today;
    const isDateSelected = selectedDate.format("YYYYMMDD") === currentDate;
    const [hover, setHover] = useState(false);

    let backgroundColor = 'white';
    let color = '';
    let border = '';

    if (isToday) {
      color = 'black';
      border = '1px solid orange';
    }

    if (isDateSelected) {
      backgroundColor = 'orange';
      color = 'white';
    }

    if (isHoliday) {
      backgroundColor = 'red';
      color = 'white';
    }

    if (isToday && isHoliday) {
      border = '1px solid orange';
    }

    if (isHoliday && isDateSelected) {
      backgroundColor = 'orange';
      color = 'red';
    }

    if (isToday && isHoliday && isDateSelected) {
      border = '1px solid orange';
      backgroundColor = 'orange';
      color = 'red';
    }

    return (
      <div style={{
        margin: 'auto',
        height: '24px',
        width: '24px',
        backgroundColor:  backgroundColor,
        filter: hover ? 'brightness(85%)' : 'none',
        color: color,
        border: border,
        borderRadius: '5px',
      }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {date.date()}
      </div>
    );
  };

  return (
    <Card
      style={{
        maxWidth: 360,
        maxHeight: 'calc(100vh - 30px)',
        overflowY: 'scroll',
      }}
    >
      <Calendar
        locale={tw}
        fullscreen={false}
        dateFullCellRender={dateFullCellRender}
        onSelect={(newDate) => {
          setSelectedDate(newDate);
          checkChannel({
            dateFrom: newDate.startOf('day').format('YYYY-MM-DD'),
            dateTo: newDate.startOf('day').add(1, 'day').format('YYYY-MM-DD'),
          });
        }}
        headerRender={() => (
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Button
              type='link'
              onClick={() => setSelectedDate((pre) => dayjs(pre).subtract(1, 'month'))}
            >
              <DoubleLeftOutlined />
            </Button>
            <div>
              {`${dayjs(selectedDate).format('YYYY')} 年`}
              {` ${dayjs(selectedDate).format('MM')} 月`}
            </div>
            <Button
              type='link'
              onClick={() => setSelectedDate((pre) => dayjs(pre).add(1, 'month'))}
            >
              <DoubleRightOutlined />
            </Button>
          </Space>
        )}
        value={selectedDate}
      />
      {isPending && reservations.length === 0 ? (
        <List
          itemLayout='horizontal'
          dataSource={Array(5)
            .fill(null)
            .map((_, index) => index)}
          rowKey={(item) => item}
          renderItem={() => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Skeleton.Button
                    active
                    style={{ width: 5 }}
                  />
                }
                title={
                  <Space>
                    <Skeleton.Button
                      size='small'
                      active
                      style={{ width: 3 }}
                    />
                    <Skeleton.Button
                      size='small'
                      active
                      style={{ width: 3 }}
                    />
                  </Space>
                }
                description={
                  <>
                    <Skeleton.Input
                      size='small'
                      active
                      style={{ width: 3 }}
                    />
                  </>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <List
          header={queryDate && <Title level={3}>{`${queryDate.format('YYYY.MM.DD(ddd)')} 預約表`}</Title>}
          rowKey={(item: ReservationOptions) => item.id}
          itemLayout='horizontal'
          dataSource={reservations}
          renderItem={(item) => (
            <LoadingMask isLoading={isPending}>
              <List.Item
                extra={[
                  <ChannelBadge
                    item={item}
                    key={item.id}
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Title
                      level={4}
                      style={{ margin: 0 }}
                    >
                      {item.date ? dayjs(item.date).format('HH:mm') : '時間...'}
                    </Title>
                  }
                  title={
                    <Space>
                      <div>{item.customerName}</div>
                      <div
                        style={{
                          color: item.type === TradeTypeNum.CustomerBuy ? 'blue' : 'red',
                        }}
                      >
                        {item.type === TradeTypeNum.CustomerBuy ? '購買' : '出售'}
                      </div>
                      <CryptoAvator type={item.cryptoType} />
                    </Space>
                  }
                  description={
                    <>
                      交易數量: <AmountLevel level={item.rangeLevel} />
                    </>
                  }
                />
              </List.Item>
            </LoadingMask>
          )}
        />
      )}
      {isSeekMore && (
        <Button
          onClick={() => {
            checkChannel({
              dateFrom: selectedDate.startOf('day').format('YYYY-MM-DD'),
              dateTo: selectedDate.startOf('day').add(1, 'day').format('YYYY-MM-DD'),
              count: 10,
              nextID: data?.nextID,
            });
          }}
          loading={isPending}
          style={{ width: '100%' }}
        >
          查詢更多
        </Button>
      )}
    </Card>
  );
};

export default Channels;
