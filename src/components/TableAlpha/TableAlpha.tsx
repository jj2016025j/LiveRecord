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
}

const TableAlpha = forwardRef<HTMLDivElement, ITableAlphaProps & TableProps>(
  (
    // prettier-ignore
    { columns: origin, dataSource: originDatas, setPageSize: syncPageSize, setPage: syncPage, ...props },
    ref
  ) => {
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

    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const datas = originDatas?.slice((page - 1) * pageSize, page * pageSize);

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
          dataSource={datas}
          footer={() => {
            if (!originDatas || originDatas.length < 10) return;
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
                  total={originDatas?.length}
                  showSizeChanger
                />
              </Space>
            );
          }}
          pagination={false}
          rowClassName={() => styles.test}
          scroll={{
            x: 'max-content',
            y: 'calc(75vh - 100px)',
          }}
          {...{ ...props, columns }}
        />
      </div>
    );
  }
);

export default TableAlpha;
