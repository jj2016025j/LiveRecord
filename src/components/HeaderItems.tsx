import { Link, useLocation, useNavigate } from 'react-router-dom';
import APEC_logo_darkUse_單 from '../assets/APEC_logo_darkUse_單.png';
import { Badge, Space } from 'antd';

type ManualLinKProps = {
  to: string;
  children: React.ReactNode;
  isActive: boolean;
};

const ManualLink = ({ to, children, isActive }: ManualLinKProps) => (
  <Link
    style={{
      color: '#fff',
      backgroundColor: isActive ? '#ED9200' : undefined,
      paddingInline: 15,
    }}
    to={to}
  >
    {children}
  </Link>
);

export const HeaderItems = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Space size='large'>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          fontSize: 24,
        }}
        onClick={() => {
          navigate('/protected');
        }}
      >
        <img
          src={APEC_logo_darkUse_單}
          alt=''
          style={{ height: 36, marginRight: 5 }}
        />
        <span> Back Office</span>
      </div>
      <div style={{ display: 'flex' }}>
        <ManualLink
          isActive={location.pathname.split('/').at(2) === 'shift'}
          to='/protected/shift'
        >
          交班
        </ManualLink>
        <ManualLink
          isActive={location.pathname.split('/').at(2) === 'member'}
          to='/protected/member'
        >
          會員
        </ManualLink>
        <ManualLink
          isActive={location.pathname.split('/').at(2) === 'history'}
          to='/protected/history'
        >
          紀錄
        </ManualLink>
        <ManualLink
          isActive={location.pathname.split('/').at(2) === 'chat'}
          to='/protected/chat'
        >
          <Badge
            count={8}
            offset={[70, -30]}
            style={{ position: 'absolute' }}
          ></Badge>
          客服對話
        </ManualLink>
      </div>
    </Space>
  );
};
