import { FallOutlined, RiseOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import * as React from 'react';
import { TradeAmountRange } from '../../../utils';

interface IAmountLevelProps {
  level: TradeAmountRange;
}

const AmountLevel: React.FunctionComponent<IAmountLevelProps> = (
  // prettier-ignore
  { level },
) => {
  const useDes = () => {
    if (level === TradeAmountRange.LessOneThousand)
      return (
        <Space>
          1,000
          <FallOutlined />
        </Space>
      );
    if (level === TradeAmountRange.LessTenThousands)
      return (
        <Space>
          10,000 <FallOutlined />
        </Space>
      );
    if (level === TradeAmountRange.OneToTwo) return <div>10,000 ~ 20,000</div>;
    if (level === TradeAmountRange.TwoToThree) return <div>20,000 ~ 30,000</div>;
    if (level === TradeAmountRange.ThreeToFive) return <div>30,000 ~ 50,000</div>;
    if (level === TradeAmountRange.OverFive)
      return (
        <div>
          50,000 <RiseOutlined />
        </div>
      );
  };

  return <>{useDes()}</>;
};

export default AmountLevel;
