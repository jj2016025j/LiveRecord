import { Space, Typography } from 'antd';
import { IoIosWarning } from 'react-icons/io';

interface IErrorBannerProps {
  message?: string;
  block?: boolean;
}

const { Title } = Typography;
const ErrorBanner: React.FunctionComponent<IErrorBannerProps> = (props) => {
  const { message, block } = props || {};
  return (
    <Space
      direction='vertical'
      style={{ alignItems: 'center', width: block ? '100%' : 'fit-content' }}
      size='small'
    >
      <IoIosWarning
        style={{ color: 'orange' }}
        fontSize={52}
      />
      <Title
        className='tight'
        level={4}
      >
        {message ? message : '請重新載入'}
      </Title>
    </Space>
  );
};

export default ErrorBanner;
