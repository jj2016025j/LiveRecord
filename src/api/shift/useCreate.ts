import dayjs from "dayjs";
import {
  CryptoTypes,
  myFactory,
  useTestMutation,
  UseTestMutationProps,
} from "../../utils";
import { axiosRoot } from "../../utils/axiosRoot";
import { CryptoCurrent, ShiftCurrentRes } from "./useShiftCurrent";

// types
type CreateShiftRes = ShiftCurrentRes & {
  id: string;
};
type CreateShiftProps = {
  setType: number;
  currentAccount: number;
  counterID: string;
  setAmount?: number;
};
type OtherProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const useCreate = (
  // prettier-ignore
  { setOpen, ...useProps }: UseTestMutationProps<CreateShiftRes, CreateShiftProps, OtherProps>
) => {
  const testMutation = useTestMutation<CreateShiftRes, CreateShiftProps>({
    ...useProps,
    delay: 0,
    mutationFn: (props) => {
      const request = axiosRoot
        .post("/shift/create", props)
        .then(({ data }) => {
          console.log("data",data)
          return data
        });

      return request;
    },
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
      const makeData: CreateShiftRes = {
        id: myFactory.string.uuid(),
        fromDate: dayjs()
          .subtract(1, "day")
          .set("hour", 16)
          .set("minute", 0)
          .set("second", 0)
          .format("YYYY-MM-DD HH:mm:ss"),
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
    onSuccess: () => {
      setOpen(false);
    },
  });

  return { ...testMutation };
};

export { useCreate };
export type { CreateShiftRes, CreateShiftProps };
