import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

interface INotFoundProps {}
const NotFound: React.FunctionComponent<INotFoundProps> = (props) => {
  const navigate = useNavigate();
  const {} = props || {};
  return (
    <>
      Not Found this page;
      <br />
      <Button onClick={() => navigate('/')}>回首頁</Button>
    </>
  );
};

export default NotFound;
