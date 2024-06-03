import { UserSwitchOutlined, TeamOutlined, FileSearchOutlined, CommentOutlined } from '@ant-design/icons';
import { Row, Col, Button, Badge } from 'antd';
import { useNavigate } from 'react-router-dom';

interface INavsProps {}

const Navs: React.FunctionComponent<INavsProps> = (props) => {
  const {} = props || {};
  const navigator = useNavigate();

  return (
    <Row
      gutter={10}
      style={{ marginBottom: 10 }}
    >
      <Col flex='auto'>
        <Button
          block
          style={{ height: 60, borderBottomRightRadius: 20 }}
          onClick={() => {
            navigator('shift');
          }}
          icon={<UserSwitchOutlined style={{ fontSize: 20 }} />}
        >
          交班
        </Button>
      </Col>
      <Col flex='auto'>
        <Button
          block
          style={{ height: 60, borderBottomRightRadius: 20 }}
          onClick={() => {
            navigator('member');
          }}
          icon={<TeamOutlined style={{ fontSize: 20 }} />}
        >
          會員
        </Button>
      </Col>
      <Col flex='auto'>
        <Button
          block
          style={{ height: 60, borderBottomRightRadius: 20 }}
          onClick={() => {
            navigator('history');
          }}
          icon={<FileSearchOutlined style={{ fontSize: 20 }} />}
        >
          紀錄
        </Button>
      </Col>
      <Col flex='auto'>
        <Button
          block
          style={{ height: 60, borderBottomRightRadius: 20 }}
          onClick={() => {
            navigator('chat');
          }}
          icon={<CommentOutlined style={{ fontSize: 20 }} />}
        >
          <Badge
            style={{ position: 'absolute', top: -30, right: '-6vw' }}
            count={8}
          />
          客服對話
        </Button>
      </Col>
    </Row>
  );
};

export default Navs;
