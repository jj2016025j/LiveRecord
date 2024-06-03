import dayjs from "dayjs";
import {
  CurrencyTypes,
  myFactory,
  useTestMutation,
  UseTestMutationProps,
} from "../../utils";

type ShiftRecord = {
  id: string;
  store: string;
  date: string;
  counterNum: number;
  totalCashIn: number;
  totalCashOut: number;
  expectBalance: number;
  actualBalance: number;
  staff: string;
  currency: CurrencyTypes;
};
type ShiftHistory = {
  history: Array<ShiftRecord>;
  nextID?: string;
};

type ShiftHistoryProps = {
  dateFrom: string;
  dateTo: string;
  nextID?: string;
  pageSize?: number;
};
type OtherProps = {};

const useShiftHistory = (
  // prettier-ignore
  { ...useProps }: UseTestMutationProps<ShiftHistory, ShiftHistoryProps, OtherProps>
) => {
  const testMutation = useTestMutation<ShiftHistory, ShiftHistoryProps>({
    ...useProps,
    delay: 1000,
    onTest: (props) => {
      const history = Array(100)
        .fill(null)
        .map(() => {
          const record: ShiftRecord = {
            id: myFactory.string.uuid(),
            store:
              myFactory.location.city() +
              myFactory.location.street().slice(0, -1),
            date: dayjs(
              myFactory.date.between({
                from: props.dateFrom,
                to: props.dateTo,
              })
            ).format(),
            counterNum: myFactory.number.int(18),
            currency: "TWD",
            totalCashIn: myFactory.number.int(10000),
            totalCashOut: myFactory.number.int(10000),
            expectBalance: myFactory.number.int(10000),
            actualBalance: myFactory.number.int(10000),
            staff: myFactory.person.fullName(),
          };
          return record;
        });
      const makeData: ShiftHistory = {
        history,
        nextID: [undefined, myFactory.string.uuid()].at(
          myFactory.number.int(1)
        ),
      };
      return Promise.resolve(makeData);
    },
  });

  return testMutation;
};

export { useShiftHistory };
export type { ShiftRecord, ShiftHistory, ShiftHistoryProps };
