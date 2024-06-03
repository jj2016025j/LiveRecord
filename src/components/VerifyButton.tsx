import { Button, ButtonProps } from "antd";
import { useState } from "react";
import { VerifyCodeModal } from "./VerifyCodeModal";

interface IVerifyButtonProps {
  onOk: () => void;
  needHash?: boolean;
}

const VerifyButton: React.FunctionComponent<
  IVerifyButtonProps & ButtonProps
> = ({ onOk, needHash, ...btnProps }) => {
  const [openVerify, setOpenVerify] = useState(false);

  return (
    <>
      <Button {...btnProps} onClick={() => setOpenVerify(true)} />
      <VerifyCodeModal
        needHash={needHash}
        open={openVerify}
        onCancel={() => setOpenVerify(false)}
        onOk={() => {
          setOpenVerify(false);
          onOk();
        }}
      />
    </>
  );
};

export default VerifyButton;
