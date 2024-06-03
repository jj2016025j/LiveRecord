import { SendOutlined, PaperClipOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { Avatar, Button, Card, Col, Divider, Input, List, Row, Typography, Upload } from 'antd';
import { useCsStore } from '@/api';
import { GiTalk } from 'react-icons/gi';
import MessageBox from './components/MessageBox';

const { Title } = Typography;

interface IDialoguePageProps { }
const DialoguePage: React.FunctionComponent<IDialoguePageProps> = (props) => {
  const { } = props || {};
  const [newMessage, setNewMessage] = useState('');
  const [selectedMemberID, setSelectedMemberID] = useState<string>();
  const { members } = useCsStore();
  const member = members.find((screenMember) => screenMember.userId === selectedMemberID);

  // Select default member
  const isSelected = useRef(false);
  useEffect(() => {
    if (isSelected.current || !members.length) return;
    isSelected.current = true;
    setSelectedMemberID(members.at(0)?.userId);
  }, [members]);

  return (
    <div
      className='px-4'
      style={{ height: '80vh' }}
    >
      <Card className=''>
        <Row>
          <Col
            span={5}
            style={{
              maxHeight: '75vh',
              overflowY: 'scroll',
              scrollbarColor: 'rgba(20,20,20,0) rgba(20,20,20, 0)',
              scrollbarWidth: 'thin',
            }}
          >
            <List
              dataSource={members}
              renderItem={(item, index) => (
                <List.Item
                  onClick={() => setSelectedMemberID(item.userId)}
                  style={{ cursor: 'pointer' }}
                  actions={[
                    <div key='1'>
                      {item.userId === selectedMemberID && <GiTalk className='text-amber-800 text-xl' />}
                    </div>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                    title={item.userName}
                    description='會員編號/連絡電話 || 訪客'
                  />
                </List.Item>
              )}
            />
          </Col>
          <Col className='py-6 mx-auto'>
            <Divider
              type='vertical'
              className='border-grey-900 h-full '
            />
          </Col>
          <Col
            span={17}
            style={{ height: '75vh' }}
          >
            <Title>{member?.userName}</Title>
            <div style={{ height: 'calc(100% - 130px)' }}>
              <MessageBox />
            </div>

            {/* 輸入框及功能 */}
            <div className='flex justify-around mt-4'>
              <Upload
                fileList={[]}
                accept='image/*'
              >
                <Button
                  type='primary'
                  style={{ borderColor: 'transparent' }}
                  icon={<PaperClipOutlined />}
                />
              </Upload>
              <Input
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    setNewMessage('');
                  }
                }}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder='輸入訊息'
                style={{ marginLeft: 5, marginRight: 5 }}
                autoFocus
              />
              <Button
                onClick={() => {
                  setNewMessage('');
                }}
                type='primary'
                style={{ borderColor: 'transparent' }}
                icon={<SendOutlined />}
              />
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DialoguePage;
