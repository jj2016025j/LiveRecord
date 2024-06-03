import dayjs from "dayjs";
import {
  CounterOperateTypeNum,
  myFactory,
  useTestMutation,
  UseTestMutationProps,
} from "../../utils";
import { axiosRoot } from "../../utils/axiosRoot";

type CounterOperateRecord = {
  id: string;
  country: string;
  store: string;
  date: string;
  serialNum: string;
  counter: string;
  type: CounterOperateTypeNum;
  amount: number;
  balance: number;
  operator: string;
};
type OperateHistoryRes = {
  history: Array<CounterOperateRecord>;
  nextID?: string;
};

type OperateHistoryProps = {
  dateFrom: string;
  dateTo: string;
  nextID?: string;
  pageSize?: number;
};
type OtherProps = {};

const useCounterHistory = (
  // prettier-ignore
  { ...useProps }: UseTestMutationProps<OperateHistoryRes, OperateHistoryProps, OtherProps>
) => {
  const testMutation = useTestMutation({
    ...useProps,
    mutationFn: (props) => {
      const request = axiosRoot
        .get("/operate/history", { params: props })
        .then(({ data }) => data);
      return request;
    },
    delay: 1000,
    onTest: (props) => {
      const history = Array(100)
        .fill("")
        .map(() => {
          const record: CounterOperateRecord = {
            id: myFactory.string.uuid(),
            country: myFactory.location.country(),
            store: myFactory.location.city(),
            date: dayjs(
              myFactory.date.between({
                from: props.dateFrom,
                to: props.dateTo,
              })
            ).format(),
            serialNum: myFactory.string.sample().slice(-8),
            counter: myFactory.number.int(19).toString().padStart(2, "0"),
            type:
              (
                [
                  CounterOperateTypeNum.Buy,
                  CounterOperateTypeNum.FillIn,
                  CounterOperateTypeNum.Sell,
                  CounterOperateTypeNum.TakeOut,
                ] as Array<CounterOperateTypeNum>
              ).at(myFactory.number.int(3)) ?? CounterOperateTypeNum.Buy,
            amount: myFactory.number.int(1000),
            balance: myFactory.number.int(1000),
            operator: myFactory.person.firstName(),
          };

          return record;
        });
      const makeData: OperateHistoryRes = {
        history,
        nextID: props.nextID,
      };

      return Promise.resolve(makeData);
    },
  });

  return { ...testMutation };
};

export { useCounterHistory };
export type { CounterOperateRecord, OperateHistoryRes, OperateHistoryProps };
