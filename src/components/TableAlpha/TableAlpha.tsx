import {
  CaretDownOutlined,
  CaretUpOutlined,
  FilterFilled,
} from "@ant-design/icons";
import { Pagination, Space, Table, TableProps } from "antd";
import { forwardRef, useState, useEffect } from "react";
import styles from "./styles.module.scss";

interface ITableAlphaProps {
  setPageSize?: React.Dispatch<React.SetStateAction<number>>;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  totalCount?: number;
  handleTableChange?: any;
}

const TableAlpha = forwardRef<HTMLDivElement, ITableAlphaProps & TableProps>(
  (props, ref) => {

    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    // useEffect(() => {
    //   console.log('TableAlpha props', props.dataSource)
    // }, [props])

    const {
      totalCount,
      columns: origin,
      dataSource: originDatas,
      setPageSize: syncPageSize,
      setPage: syncPage,
      handleTableChange,
      ...tableProps
    } = props || {};

    const columns = origin
      ? origin.map((originColumn) => {
        const column: typeof originColumn = {
          filterIcon: <FilterFilled className={styles.filter} />,
          sortIcon: ({ sortOrder }) => (
            <span className={styles["box-sorter"]}>
              <CaretUpOutlined
                className={`${styles.sorter}
                ${sortOrder === "ascend" && styles.active}
                `}
              />
              <CaretDownOutlined
                className={`${styles.sorter}
              ${sortOrder === "descend" && styles.active}
              `}
              />
            </span>
          ),
          ...originColumn,
        };
        return column;
      })
      : undefined;

    type TableRowSelection<T> = TableProps<T>['rowSelection'];

    interface DataType {
      key: React.ReactNode;
      name: string;
      age: number;
      address: string;
      children?: DataType[];
    }

    const rowSelection: TableRowSelection<DataType> = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
      },
    };

    useEffect(() => {
      if (!syncPage) return;
      syncPage(page);
    }, [syncPage, page]);

    useEffect(() => {
      if (!syncPageSize) return;
      syncPageSize(pageSize);
    }, [syncPageSize, pageSize]);

    return (
      <div ref={ref}>
        <Table
          dataSource={originDatas}
          footer={() => {
            if (!originDatas) return;
            return (
              <Space
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  paddingInline: 15,
                }}
              >
                <div></div>
                <Pagination
                  onChange={(newPage, newSize) => {
                    if (newSize) setPageSize(newSize);
                    if (newPage) setPage(newPage);
                  }}
                  total={totalCount ?? originDatas?.length}
                  showSizeChanger
                  current={page}
                />
              </Space>
            );
          }}
          rowSelection={{ ...rowSelection }}
          pagination={false}
          rowClassName={() => styles.test}
          scroll={{
            x: 'max-content',
            y: 'calc(90vh - 250px)',
          }}
          onChange={handleTableChange}
          {...{ ...tableProps, columns }}
        />
      </div>
    );
  }
);

export default TableAlpha;
