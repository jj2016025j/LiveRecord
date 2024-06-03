import { Image, Typography } from 'antd';

const { Text } = Typography;

interface IMessageBoxProps {}
const MessageBox: React.FunctionComponent<IMessageBoxProps> = (props) => {
  const {} = props || {};
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'start',
          alignSelf: 'self-start',
          marginBottom: 20,
        }}
      >
        <div
          style={{
            background: '#f0f0f0',
            padding: 10,
            borderRadius: 10,
            maxWidth: '55%',
            marginLeft: 5,
          }}
        >
          <Text>info</Text>
        </div>
        <div style={{ display: 'flex', alignSelf: 'self-end', marginLeft: 10 }}>
          <Text style={{ color: '#595959' }}>time</Text>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'start',
          alignSelf: 'self-start',
          marginBottom: 20,
        }}
      >
        <div
          style={{
            background: '#f0f0f0',
            padding: 10,
            borderRadius: 10,
            maxWidth: '22%',
            minWidth: '20%',
            maxHeight: 'fit-content',
            marginLeft: 5,
          }}
        >
          <Image
            alt='img'
            width='100%'
          />
        </div>
        <div style={{ display: 'flex', alignSelf: 'self-end', marginLeft: 10 }}>
          <Text style={{ color: '#595959' }}>time</Text>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'start',
          marginBottom: 20,
          justifyContent: 'flex-end',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignSelf: 'self-end',
            marginRight: 10,
          }}
        >
          <Text style={{ color: '#595959' }}>time</Text>
        </div>
        <div
          style={{
            background: '#ffe58f',
            padding: 10,
            borderRadius: 10,
            maxWidth: '55%',
          }}
        >
          <Text style={{ color: '#000' }}>info</Text>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'start',
          marginBottom: 20,
          justifyContent: 'flex-end',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignSelf: 'self-end',
            marginRight: 10,
          }}
        >
          <Text style={{ color: '#595959' }}>time</Text>
        </div>
        <div
          style={{
            background: '#ffe58f',
            padding: 10,
            borderRadius: 10,
            maxWidth: '22%',
            minWidth: '20%',
            maxHeight: 'fit-content',
          }}
        >
          <Image
            alt='img'
            width='100%'
          />
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
