import MemberTable from './MemberTable';
import { Card, Space, DatePicker, Input, Segmented, Button } from 'antd';
import { useEffect, useReducer, useRef, useState } from 'react';
import { VerifyStatusNum } from '../../utils';
import { PrinterFilled } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';
import { useLocation } from 'react-router-dom';
import type { DatePickerProps } from 'antd';
import dayjs from 'dayjs';


type MemberPageStates = {
  verifyStatus: VerifyStatusNum;
  memberSearch: string;
  isPrinting: boolean;
};
type ReducerProps = {
  setVeriyStatus?: VerifyStatusNum;
  setMemberSearch?: string;
  setIsPrinting?: boolean;
};
type MemberPageReducer = (states: MemberPageStates, props: ReducerProps) => MemberPageStates;
const MemberPage: React.FunctionComponent = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });

  // DOM
  const [state, dispatch] = useReducer<MemberPageReducer>(
    (origin, { setVeriyStatus, setMemberSearch, setIsPrinting }) => {
      if (setVeriyStatus !== undefined) origin.verifyStatus = setVeriyStatus;
      if (setMemberSearch !== undefined) origin.memberSearch = setMemberSearch;
      if (setIsPrinting !== undefined) origin.isPrinting = setIsPrinting;
      return { ...origin };
    },
    { verifyStatus: 0, memberSearch: '', isPrinting: false },
  );

  const { verifyStatus, memberSearch, isPrinting } = state;
  const [selectedDate, setSelectDate] = useState<dayjs.Dayjs | null>(null);

  const selectDate: DatePickerProps['onChange'] = (date) => {
    setSelectDate(date ? dayjs(date) : null);
  };

  // init
  useEffect(() => {
    if (location.state?.tab) {
      dispatch({ setVeriyStatus: location.state.tab });
    }
  }, [location]);

  return (
    <>
      <Card
        styles={{
          body: {
            padding: 0,
          },
        }}
        title='會員列表'
        extra={
          <Space>
            <Input
              value={memberSearch}
              onChange={(e) => dispatch({ setMemberSearch: e.target.value })}
              placeholder='搜尋會員編號/電話/身分證'
            />
          </Space>
        }
      >
        <Space
          style={{
            width: '100%',
            justifyContent: 'space-between',
            padding: 10,
          }}
        >
          <Segmented
            style={{
              padding: 0,
            }}
            value={verifyStatus}
            onChange={(value) => {
              dispatch({ setVeriyStatus: value });
            }}
            size='large'
            options={[
              {
                label: (
                  <span
                    key='1'
                    style={{ color: 'orange' }}
                  >
                    審核中
                  </span>
                ),
                value: VerifyStatusNum.Verifing,
              },
            ]}
          />
          <Space>
            請選擇註冊日期:
            <DatePicker onChange={selectDate} />
          </Space>
          <Button
            onClick={() => handlePrint()}
            type='link'
            icon={<PrinterFilled />}
          >
            列印
          </Button>
        </Space>

        <MemberTable
          ref={tableRef}
          {...{ verifyStatus, memberSearch, isPrinting, selectedDate  }}
        />
      </Card>
    </>
  );
};
export default MemberPage;
