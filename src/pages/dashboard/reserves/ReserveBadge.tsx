import { Badge } from 'antd';
import dayjs from 'dayjs';
import { ReservationOptions } from '../../../api';

interface IChannelBadgeProps {
  item: ReservationOptions;
}

const ChannelBadge: React.FunctionComponent<IChannelBadgeProps> = (props) => {
  const { item } = props || {};

  if (
    dayjs().add(10, 'minute').isAfter(item.date) && // 十分鐘上下的Range會顯示紅點
    dayjs().subtract(10, 'minute').isBefore(item.date)
  )
    return (
      <Badge
        dot
        key='badge'
      />
    );
  return <div key='badge'></div>;
};

export default ChannelBadge;
