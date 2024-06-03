import { Col, Row, } from 'antd';
import OverviewCard from './overview/OverviewCard';
import QueryMember from './queryMember/QueryMember';
import HistoryPage from '../history/HistoryPage';

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
          <OverviewCard />
        </Col>
        <Col span={12}>
          {/* 清單 */}
          <HistoryPage />
        </Col>
      </Row>
    </>
  );
};
export default DashboardPage;
