import { Col, Row, } from 'antd';
import LiveOverview from './LiveOverview';
import QueryMember from './QueryMember';
import LiveList from './LiveList';
import { useState } from 'react';

const DashboardPage = () => {
  const [liveUrl, setLiveUrl] = useState<string>('')

  return (
    <>
      <Row
        gutter={[10, 10]}
        wrap={false}
      >
        <Col span={12}>
          {/* 查詢區 */}
          <QueryMember setLiveUrl={setLiveUrl} />
          {/* 影片播放區 */}
          <LiveOverview liveUrl={liveUrl} />
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
