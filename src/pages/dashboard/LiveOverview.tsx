import { Button, Card, List, Space, Spin, Typography } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

const { Meta } = Card;
const { Title } = Typography;

interface IOverviewCardProps {
  liveUrl: string;
}

const OverviewCard: React.FunctionComponent<IOverviewCardProps> = (props) => {
  const [youtubeOpen, setYoutubeOpen] = useState(false);
  const [liveOpen, setLiveOpen] = useState(true);
  const [channels, setChannels] = useState<any>([]);
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/channels')
      .then(response => {
        setChannels(response.data);
        setLoading(false);
        if (response.data.length > 0) {
          loadChannel(response.data[0].live_stream_url);
        }
      })
      .catch(error => {
        console.error('Error fetching channels:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (channels.length > 0) {
      loadChannel(channels[currentChannelIndex].live_stream_url);
    }
  }, [currentChannelIndex, channels]);

  const loadChannel = (url: string) => {
    // 加載直播流的邏輯，例如通過 iframe 嵌入直播
  };

  const handlePrevChannel = () => {
    setCurrentChannelIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : channels.length - 1));
  };

  const handleNextChannel = () => {
    setCurrentChannelIndex((prevIndex) => (prevIndex < channels.length - 1 ? prevIndex + 1 : 0));
  };

  const { liveUrl } = props;

  return (
    <Card
      styles={{
        header: { borderBottom: 0 },
      }}
    >
      <Spin spinning={loading}>
        <Space style={{ marginBottom: 20 }}>
          <Button onClick={handlePrevChannel} type="primary" style={{ marginRight: 10 }}>上一個</Button>
          <Button onClick={handleNextChannel} type="primary">下一個</Button>
        </Space>
        {channels.length > 0 && liveOpen && (
          <ReactPlayer
            url={liveUrl}
            playing
            controls
            height="500px"
            width="100%"
          />
        )}
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={channels}
          renderItem={(channel, index) => (
            <List.Item>
              <Card
                hoverable
                onClick={() => setCurrentChannelIndex(index)}
                style={{ width: 240 }}
                cover={<img alt="Preview" src={channel.preview_image} />}
              >
                <Meta title={channel.name} description={channel.url} />
              </Card>
            </List.Item>
          )}
          style={{ marginTop: 20 }}
        />
      </Spin>
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
      {youtubeOpen && (
        <ReactPlayer
          url={'https://www.youtube.com/watch?v=gp2K_xfEDoU'}
          playing
          controls
          width="100%"
          height="500px"
        />
      )}
    </Card>
  );
};

export default OverviewCard;
