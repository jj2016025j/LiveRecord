import { Col, Row, } from 'antd';
import LiveOverview from './liveOverview/LiveOverview';
import QueryMember from './queryMember/QueryMember';
import LiveList from '../history/LiveList';

const DashboardPage = () => {
  return (
    <>
      <Row
        gutter={[10, 10]}
        wrap={false}
      >
        <Col span={12}>
          {/* 查詢區 */}
          <QueryMember />
          {/* 影片播放區 */}
          <LiveOverview />
        </Col>
        <Col span={12}>
          {/* 清單 */}
          <LiveList />
        </Col>
      </Row>
    </>
  );
};
export default DashboardPage;
