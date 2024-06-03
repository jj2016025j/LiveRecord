import { PrinterOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useSummaryShift } from '../../api';
import ShiftReport from './components/ShiftReport';
import ShiftClose from './components/ShiftClose';
import { useOnTesting } from '@/api';

interface IShiftPageProps { }
const { Title } = Typography;
const ShiftPage: React.FunctionComponent<IShiftPageProps> = (props) => {
  const pageRef = useRef<HTMLDivElement>(null);
  // DOM
  const { } = props || {};
  const [openClose, setOpenClose] = useState(false);
  // query
  const { useCurrent, useCreate, useClose, shiftInfo, updateDate } = useSummaryShift({
    current: {},
    create: {},
    close: {
      setOpenClose,
    },
  });
  const { isPending, isRefetching, refetch } = useCurrent();
  const { mutate: create, isPending: creating } = useCreate();
  const { data: closeData, mutate: close, reset, isPending: closing } = useClose();
  const onTesting = useOnTesting()

  // handlers
  const handlePrint = useReactToPrint({
    content: () => pageRef.current,
  });

  return (
    <>
      <Card
        title={<Title level={3}>交班帳務</Title>}
        extra={
          closeData ? (
            <Space>
              <Button
                onClick={() => {
                  reset();
                }}
              >
                返回
              </Button>
            </Space>
          ) : (
            <Space>
              <Button
                loading={isPending || isRefetching}
                onClick={() => {
                  refetch({});
                }}
              >
                更新
              </Button>
              {shiftInfo ? (
                <>
                  <Button
                    loading={isPending || isRefetching || creating}
                    onClick={() => {
                      setOpenClose(true);
                    }}
                    type='primary'
                  >
                    交班
                  </Button>
                  {onTesting &&
                    <Button
                      loading={isPending || isRefetching || creating}
                      onClick={() => {
                        close({});
                      }}
                      type='primary'
                    >
                      關班
                    </Button>
                  }
                </>
              ) : (
                <Button
                  loading={isPending || isRefetching || creating}
                  onClick={() => create({})}
                  type='primary'
                >
                  開班
                </Button>
              )}
            </Space>
          )
        }
        styles={{
          body: {
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            position: 'relative',
          },
        }}
      >
        <Space
          style={{ position: 'absolute', top: 20, right: 20 }}
          onClick={() => handlePrint()}
        >
          <Button type='link'>
            列印
            <PrinterOutlined />
          </Button>
        </Space>
        {/* 頁面內容 */}
        <ShiftReport
          ref={pageRef}
          isLoading={isPending || isRefetching}
          {...{ updateDate, shiftInfo }}
        />
      </Card>

      <ShiftClose
        {...{ closing, close }}
        open={openClose}
        setOpen={setOpenClose}
        counterAccount={shiftInfo?.currentAccount}
      />
    </>
  );
};
export default ShiftPage;
