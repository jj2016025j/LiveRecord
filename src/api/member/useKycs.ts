import dayjs from 'dayjs';
import { CurrencyTypes, myFactory, useTestQuery, UseTestQueryProps, VerifyStatusNum } from '../../utils';
import { axiosRoot } from '../../utils/axiosRoot';

// type
type KycRecordOptions = {
  id: string;
  country: string;
  registerDate: string;
  lastPassDate: string;
  verifyTimes: number;
  memberName: string;
  memberID: string;
  phone: string;
  txTimes: number;
  volume: number;
  currency: CurrencyTypes;
  status: VerifyStatusNum;
};
type KycsRes = Array<KycRecordOptions>;
type KycsProps = {};
type OtherProps = {};

const useKycs = ({ ...useProps }: UseTestQueryProps<OtherProps, KycsProps>) => {
  const testQuery = useTestQuery<KycsRes, KycsProps>({
    ...useProps,
    queryKey: ['kycs'],
    qf: () => {
      const request = axiosRoot
        .get<
          Array<{
            userId: string;
            userName: string;
          }>
        >('/kyc/pending')
        .then(({ data }) => {
          const makeData = data.map((kyc) => {
            const makeKyc: KycRecordOptions = {
              id: myFactory.string.uuid(),
              country: myFactory.location.country(),
              registerDate: dayjs(myFactory.date.past()).format('YYYY-MM-DD HH:mm:ss'),
              lastPassDate: dayjs(myFactory.date.recent()).format('YYYY-MM-DD HH:mm:ss'),
              verifyTimes: myFactory.number.int(10),
              memberName: kyc.userName,
              memberID: kyc.userId,
              phone: myFactory.phone.number(),
              txTimes: myFactory.number.int(10),
              volume: myFactory.number.int(10000),
              currency: 'TWD',
              status: VerifyStatusNum.Verifing,
            };
            return makeKyc;
          });
          return makeData;
        });
      return request;
    },
  });

  return { ...testQuery };
};

export { useKycs };
export type { KycRecordOptions, KycsRes, KycsProps };
