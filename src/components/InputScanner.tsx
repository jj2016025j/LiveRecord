import { Input, Space, } from 'antd';

interface IInputScannerProps {
  value?: string;
  onChange?: (value: string) => void;
  onClickScannBtn?: () => void;
}

const InputScanner: React.FunctionComponent<IInputScannerProps> = (props) => {
  const { value, onChange } = props || {};
  return (
    <Space.Compact style={{ width: '100%' }}>
      <Input
        placeholder='輸入網址/用戶名稱'
        value={value}
        onChange={(e) => {
          if (onChange) onChange(e.target.value);
        }}
      />
    </Space.Compact>
  );
};

export default InputScanner;
