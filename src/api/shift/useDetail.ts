import dayjs from "dayjs";
import {
  CryptoTypes,
  myFactory,
  useTestQuery,
  UseTestQueryProps,
} from "../../utils";
import { axiosRoot } from "../../utils/axiosRoot";
import { CryptoCurrent, ShiftCurrentRes } from "./useShiftCurrent";

type ShiftDetail = ShiftCurrentRes & {
  toDate: string;
};
type ShiftDetailProps = {
  id: string;
};
type OtherProps = {};

const useDetail = (
  // prettier-ignore
  { params, ...useProps }: UseTestQueryProps<OtherProps, ShiftDetailProps>
) => {
  const testQuery = useTestQuery<ShiftDetail, ShiftDetailProps>({
    ...useProps,
    queryKey: ["shift", "detail", params?.id],
    qf: (params) => {
      const request = axiosRoot
        .get("/shift/detail", { params })
        .then(({ data }) => data);
      return request;
    },
    delay: 1000,
    onTest: () => {
      const cryptosTypes: Array<CryptoTypes> = [
        "BTC",
        "ERC20_USDT",
        "ETH",
        "TRC20_USDT",
        "TRX",
      ];
      const cryptos = cryptosTypes.map((currency) => {
        const buyAmount = myFactory.number.float({ min: 100, max: 10000 });
        const sellAmount = myFactory.number.float({ min: -10000, max: -100 });
        const makeData: CryptoCurrent = {
          crypto: currency,
          buy: {
            numOfOrders: myFactory.number.int(20),
            amount: buyAmount,
            counterAccount: Math.round(buyAmount / 30.15),
          },
          sell: {
            numOfOrders: myFactory.number.int(20),
            amount: sellAmount,
            counterAccount: Math.round(sellAmount / 30.15),
          },
          subTotal: {
            numOfOrders: myFactory.number.int(20),
            amount: buyAmount + sellAmount,
            counterAccount: Math.round((buyAmount + sellAmount) / 30.15),
          },
        };
        return makeData;
      });
      const lastShiftBalance = myFactory.number.int({ min: 10000, max: 30000 });
      const transactionAmount = cryptos.reduce((pre, current) => {
        return pre + current.subTotal.amount;
      }, 0);
      const counterTopup = myFactory.number.int(5000);
      const counterTakeout = myFactory.number.int({ max: 0, min: -5000 });
      const fromDate = dayjs(myFactory.date.anytime()).format();
      const makeData: ShiftDetail = {
        toDate: dayjs(fromDate).add(8, "hour").format(),
        fromDate: fromDate,
        cryptos,
        location: "台中逢甲",
        counterNum: myFactory.number.int({ min: 1, max: 10 }),
        counterStaff: myFactory.person.firstName(),
        lastShiftBalance,
        transactionAmount,
        counterTopup,
        counterTakeout,
        currentAccount:
          lastShiftBalance + transactionAmount + counterTopup + counterTakeout,
      };

      return Promise.resolve(makeData);
    },
  });

  return { ...testQuery };
};

export { useDetail };
export type { ShiftDetail, ShiftDetailProps, OtherProps };
