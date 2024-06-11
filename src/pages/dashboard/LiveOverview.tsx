import { Button, Card, Space, Typography } from 'antd';
import { useState } from 'react';
import ReactPlayer from 'react-player';

interface IOverviewCardProps {
  liveUrl: string
}

const { Title } = Typography;
const OverviewCard: React.FunctionComponent<IOverviewCardProps> = (porps) => {
  const [youtubeOpen, setYoutubeOpen] = useState(false)
  const [liveOpen, setLiveOpen] = useState(false)

  const { liveUrl } = porps
  return (
    <Card
      styles={{
        header: { borderBottom: 0 },
      }}
    >
      <Space style={{ margin: '0 0 10px 0' }}>
        <Title
          level={3}
          style={{ fontWeight: 'bold', margin: 0, marginRight: 10 }}
        >
          {'預覽畫面'}
        </Title>
        <Button onClick={() => setYoutubeOpen(!youtubeOpen)}>
          YouTube 開關
        </Button>
        {liveUrl && <Button onClick={() => setLiveOpen(!liveOpen)}>
          Live 開關
        </Button>}
      </Space>
      <br />
      {liveUrl && liveOpen && <ReactPlayer url={liveUrl} playing controls width="100%" />}
      {youtubeOpen && (
        <ReactPlayer
          url={'https://www.youtube.com/watch?v=gp2K_xfEDoU'}
          playing
          controls
          width="100%"
          height="100%"
        />
      )}
    </Card>
  );
};

export default OverviewCard;
