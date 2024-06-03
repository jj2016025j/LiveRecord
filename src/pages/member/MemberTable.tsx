import { forwardRef } from 'react';
import { useKycs } from '../../api/member';
import TableAlpha from '../../components/TableAlpha';
import { VerifyStatusNum } from '../../utils';
import { useColumns } from './useColumns';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react'

interface IMemberTableProps {
  verifyStatus: VerifyStatusNum;
  memberSearch: string;
  isPrinting: boolean;
  selectedDate: dayjs.Dayjs | null;
}

interface KycRecordOptions {
  country: string;
  currency: string;
  id: string;
  lastPassDate: string;
  memberID: string;
  memberName: string;
  phone: string;
  registerDate: string;
  status: number;
  txTimes: number;
  verifyTimes: number;
  volume: number;
}

const MemberTable = forwardRef<HTMLDivElement, IMemberTableProps>(function MemberTable(props, ref) {
  const { verifyStatus, memberSearch, selectedDate } = props || {};
  const { data } = useKycs({});
  // const { data } = useCustomerList({});
  const { columns } = useColumns({});
  const [filteredData, setFilteredData] = useState<KycRecordOptions[]>([]);
  const [showData, setShowData] = useState<KycRecordOptions[]>([]);

  useEffect(() => {
    let filterData = data ? data.filter((screenData) => {
      const getSearch = () => {
        const { memberName, memberID, phone } = screenData;
        const purePhone = phone.replaceAll('-', '');
        return (
          memberName.includes(memberSearch) ||
          memberID.includes(memberSearch) ||
          purePhone.includes(memberSearch) ||
          phone.includes(memberSearch)
        );
      };
      return screenData.status === verifyStatus && getSearch();
    }) : []

    setShowData(filterData)
  }, [data])

  useEffect(() => {
    if (!selectedDate) {
      setFilteredData(showData || [])
    }
    else {
      const filtered = (showData || [])?.filter(data => {
        const registerDate = dayjs(data.registerDate).startOf('day');
        const checkDate = selectedDate ? dayjs(selectedDate).startOf('day') : null;
        console.log('showData', showData)//因為日期會一直變動所以先留著驗證用
        console.log('registerDate', registerDate);//因為日期會一直變動所以先留著驗證用
        return checkDate ? registerDate.isSame(checkDate, 'day') : false;
      }) || []
      setFilteredData(filtered);
    }
  }, [selectedDate, showData, data]);

  return (
    <>
      <TableAlpha
        ref={ref}
        size='small'
        rowKey='id'
        columns={columns}
        dataSource={filteredData}
      />
    </>
  );
});

export default MemberTable;
