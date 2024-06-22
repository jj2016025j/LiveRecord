import { Button, Select, SelectProps, SpaceProps } from 'antd';
import { TiDelete } from 'react-icons/ti';

interface IAntSelectProps extends SelectProps {
  onDelete?: () => void;
  containProps?: SpaceProps;
}

const AntSelect: React.FunctionComponent<IAntSelectProps> = (props) => {
  const { onDelete, containProps, ...selectProps } = props || {};

  return (
    <span style={{ display: 'flex' }}>
      <Select {...selectProps} />
      {onDelete && (
        <Button
          style={{ marginLeft: 15 }}
          danger
          onClick={() => onDelete()}
          shape='circle'
          icon={<TiDelete style={{fontSize: 24}}  />}
        ></Button>
      )}
    </span>
  );
};

export default AntSelect;
