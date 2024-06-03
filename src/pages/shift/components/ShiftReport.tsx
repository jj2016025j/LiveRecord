import { Skeleton, Space, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { forwardRef } from 'react';
import { CryptoTypes, nTot } from '@/utils';
import styles from './history.module.scss';
// fortest
import { useDetail } from '@/api'
import TodosFlow from '@/components/TodosFlow';
const { Title } = Typography;
const format = 'YYYY.MM.DD (ddd) HH:mm:ss';
export type CryptoCurrent = {
  crypto: CryptoTypes;
  buy: {
    numOfOrders: number;
    amount: number;
    counterAccount: number;
  };
  sell: {
    numOfOrders: number;
    amount: number;
    counterAccount: number;
  };
  subTotal: {
    numOfOrders: number;
    amount: number;
    counterAccount: number;
  };
};

export type ShiftInfoOptions = {
  cryptos: Array<CryptoCurrent>;
  location: string;
  counterNum: number;
  counterStaff: string;
  lastShiftBalance: number;
  transactionAmount: number;
  counterTopup: number;
  counterTakeout: number;
  currentAccount: number;
  fromDate: string;
};

interface IShiftReportProps {
  updateDate: Dayjs | undefined;
  isLoading?: boolean;
  isHorizontal?: boolean;
  shiftInfo: undefined | ShiftInfoOptions;
}
const ShiftReport = forwardRef<HTMLDivElement, IShiftReportProps>(function ShiftReport(props, ref) {
  const { shiftInfo, updateDate, isLoading, isHorizontal } = props || {};
  const { location, counterStaff, lastShiftBalance, cryptos, transactionAmount, counterTopup } = shiftInfo || {};
  const { counterTakeout, currentAccount, fromDate, counterNum } = shiftInfo || {};
  const fromDateFormat = fromDate ? dayjs(fromDate).format(format) : '';
  // for test
  console.log('shiftInfo', shiftInfo)
  const { data } = useDetail({ isTest: true })
  console.log(data?.cryptos)
  let { cryptos: cryptosForTest } = data || {}
  // for test

  if (!isLoading && shiftInfo) {
    return (
      <>

        <TodosFlow isTest={true} todos={[{ title: '交班人員欄位' }]} />
        <div
          ref={ref}
          className={`${styles.paper} ${isHorizontal && styles.horizontal}`}
        >
          {/* header */}
          <div className={`${styles['box-title']}`}>
            <div className={styles.header}>
              <Title className='tight'>交班帳務</Title>
              <div className={styles.tag}>{location}</div>
            </div>
            <div className={styles.date}>{`${fromDateFormat} - ${updateDate?.format(format)}`}</div>
            <div className={styles['counter-info']}>
              <span>{`櫃台 ${shiftInfo && counterNum !== undefined ? counterNum.toString().padStart(2, '0') : ''
                }`}</span>
              <span>{`交班人員: ${counterStaff || '-'}`}</span>
              <span>{`上一班結餘 ${nTot({ value: lastShiftBalance })}`}</span>
            </div>
          </div>

          <div className={`${styles['box-content']} `}>
            {/* 置上 */}
            <div
              className={`${styles.row}
				${isHorizontal && styles.horizontal}
				`}
            >
              {/* 不同幣別的表 */}
              {/* for test */}
              {cryptosForTest?.map((cryptoInfo) => {
                {/* for test */ }
                return (
                  <table
                    className={`${styles['table-crypto']}
								${isHorizontal && styles.horizontal}
								`}
                    key={cryptoInfo.crypto}
                  >
                    <thead>
                      <tr>
                        <th>{cryptoInfo.crypto}</th>
                        <th>筆數</th>
                        <th>數量</th>
                        <th>櫃台金額</th>
                      </tr>
                    </thead>
                    <tbody className={styles['tb-cal']}>
                      <tr className={styles['tr-buy']}>
                        <td>購買</td>
                        <td>{nTot({ value: cryptoInfo.buy.numOfOrders })}</td>
                        <td>
                          {nTot({
                            value: cryptoInfo.buy.amount,
                            digitsType: cryptoInfo.crypto,
                          })}
                        </td>
                        <td>{nTot({ value: cryptoInfo.buy.counterAccount })}</td>
                      </tr>
                      <tr className={styles['tr-sell']}>
                        <td>售出</td>
                        <td>{nTot({ value: cryptoInfo.sell.numOfOrders })}</td>
                        <td>
                          {nTot({
                            value: cryptoInfo.sell.amount,
                            digitsType: cryptoInfo.crypto,
                          })}
                        </td>
                        <td>{nTot({ value: cryptoInfo.sell.counterAccount })}</td>
                      </tr>
                    </tbody>

                    <tbody className={styles['tb-subtotal']}>
                      <tr>
                        <td className={styles['text-capture']}>小計</td>
                        <td>{nTot({ value: cryptoInfo.subTotal.numOfOrders })}</td>
                        <td>
                          {nTot({
                            value: cryptoInfo.subTotal.amount,
                            digitsType: cryptoInfo.crypto,
                          })}
                        </td>
                        <td>
                          {nTot({
                            value: cryptoInfo.subTotal.counterAccount,
                          })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                );
              })}
            </div>
            {/* 置底 */}
            <div className={`${styles.row}`}>
              {/* 結算 */}
              <div className={styles['box-summary']}>
                <div className={styles['box-item']}>
                  <strong>上一班結餘</strong>
                  <span>{nTot({ value: lastShiftBalance })}</span>
                </div>
                <div className={styles['box-item']}>
                  <strong>當班櫃台交易數量</strong>
                  <span>
                    {nTot({
                      value: transactionAmount,
                      digitsType: 'TWD',
                    })}
                  </span>
                </div>
                <div className={styles['box-item']}>
                  <strong>櫃台補入</strong>
                  <span>{nTot({ value: counterTopup })}</span>
                </div>
                <div className={styles['box-item']}>
                  <strong>櫃台取出</strong>
                  <span>{nTot({ value: counterTakeout })}</span>
                </div>
                <div className={styles['box-result']}>
                  <strong>櫃台應剩餘</strong>
                  <span>
                    {nTot({
                      value: currentAccount,
                      digitsType: 'TWD',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        {/* 使用 Grid 垂直分布 */}
        <div className={`${styles.paper} ${isHorizontal ? styles.horizontal : styles.vertical}`}>
          {/* 置上 */}
          <div className={styles.row}>
            {/* header */}
            <div className={styles.header}>
              <Title className='tight'>交班帳務</Title>
              <Skeleton.Button active />
            </div>
            <Space
              direction='vertical'
              style={{ width: '100%' }}
            >
              <div className={styles.date}>
                <Skeleton.Input
                  style={{ width: '10cm' }}
                  size='small'
                  active
                />
              </div>
              <div className={styles['counter-info']}>
                <Skeleton.Input
                  style={{ width: '1cm' }}
                  size='small'
                  active
                />
                <Skeleton.Input
                  style={{ width: '1cm' }}
                  size='small'
                  active
                />
                <Skeleton.Input
                  style={{ width: '1cm' }}
                  size='small'
                  active
                />
              </div>
            </Space>

            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
          </div>

          {/* 置底 */}
          <div className={styles.row}>
            <Skeleton active />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        ref={ref}
        className={`${styles.paper} ${isHorizontal && styles.horizontal}`}
      >
        {/* header */}
        <div className={`${styles['box-title']}`}>
          <div className={styles.header}>
            <Title className='tight'>交班帳務</Title>
          </div>
          <div className={styles['counter-info']}>
            <span>{'尚未開班，請先完成開班...'}</span>
          </div>
        </div>
      </div>
    </>
  );
});

export default ShiftReport;
