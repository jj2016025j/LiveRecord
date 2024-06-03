import { VerifyStatusNum } from '@/utils';

interface IVerifyStatusLabelProps {
  status: VerifyStatusNum | undefined;
}

const VerifyStatusLabel: React.FunctionComponent<IVerifyStatusLabelProps> = (props) => {
  const { status } = props || {};

  if (status === VerifyStatusNum.Pass) return <span style={{ color: 'green' }}>已通過</span>;
  if (status === VerifyStatusNum.Fail) return <span style={{ color: 'red' }}>不通過</span>;
  if (status === VerifyStatusNum.Verifing) return <span style={{ color: 'orange' }}>審核中</span>;
  return <span >未定義</span>
};

export default VerifyStatusLabel;
