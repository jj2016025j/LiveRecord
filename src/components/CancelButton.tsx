import { Button, ButtonProps } from 'antd';
import { useState } from 'react';
import { Verification } from './Verification';

interface ICancelButtonProps {
  onOk: () => void;
}

const CancelButton: React.FunctionComponent<ICancelButtonProps & ButtonProps> = (props) => {
  const { onOk, ...buttonProps } = props || {};
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size='small'
        danger
        onClick={() => setOpen(true)}
        {...buttonProps}
      >
        取消
      </Button>

      <Verification
        onOk={() => {
          setOpen(false);
          onOk();
        }}
        onCancel={() => {
          setOpen(false);
        }}
        open={open}
      />
    </>
  );
};

export default CancelButton;
