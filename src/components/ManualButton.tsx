import { Button, ButtonProps } from "antd";

interface IManualButtonProps {
  children: React.ReactNode;
}

const ManualButton: React.FunctionComponent<
  IManualButtonProps & ButtonProps
> = (
  // prettier-ignore
  {children, ...props}
) => {
  return <Button {...props}>{children}</Button>;
};

export default ManualButton;
