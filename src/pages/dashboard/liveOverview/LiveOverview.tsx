import { Card, Typography } from 'antd';
import ReactPlayer from 'react-player';

interface IOverviewCardProps { }


const { Title } = Typography;
const OverviewCard: React.FunctionComponent<IOverviewCardProps> = () => {
  return (
    <Card
      styles={{
        header: { borderBottom: 0 },
      }}
    >
      <Title
        level={3}
        style={{ fontWeight: 'bold', margin: 0, marginRight: 10 }}
      >
        {'預覽畫面'}
      </Title>
      {/* <video width="100%" controls>
        <source src={'https://www.youtube.com/watch?v=gp2K_xfEDoU'} type={"video/mp4"} />
        只能用來放已儲存的影片，直播不行
      </video> */}
      <br />
      <ReactPlayer url={'https://www.youtube.com/watch?v=gp2K_xfEDoU'} playing controls width="100%" />
    </Card>
  );
};

export default OverviewCard;
