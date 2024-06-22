import { useAdminStore } from "../../store";
import { myFactory, useTestQuery, UseTestQueryProps } from "../../utils";
import { axiosRoot } from "../../utils/axiosRoot";
import { TwAccountOptions } from "./useCountryAccount";

type DefaultAccountOptions = {
  id: string;
  store: string;
  accountInfo: null | TwAccountOptions;
};

type DefaultAccountsRes = {
  tw: Array<DefaultAccountOptions>;
};

type OtherProps = {};

const useDefaultAccounts = (
  // prettier-ignore
  { ...useProps }: UseTestQueryProps<OtherProps, DefaultAccountsRes>
) => {
  const { setDefaultAccounts, allAccounts } = useAdminStore();

  const testQuery = useTestQuery({
    ...useProps,
    queryKey: ["default", "accounts"],
    qf: () => {
      const request = axiosRoot
        .get("/admin/account/default")
        .then(({ data }) => data);
      return request;
    },
    onSuccess: (res) => {
      setDefaultAccounts(res);
    },
    delay: 1000,
    onTest: () => {
      const makeData: DefaultAccountsRes = {
        tw: Array(5)
          .fill(null)
          .map(() => {
            const acc: DefaultAccountOptions = {
              id: myFactory.string.uuid(),
              store: myFactory.location.street().slice(0, -1) + "店",
              accountInfo:
                allAccounts?.tw.at(
                  myFactory.number.int(allAccounts.tw.length)
                ) ?? null,
            };
            return acc;
          }),
      };

      return Promise.resolve(makeData);
    },
  });

  return { ...testQuery };
};

export { useDefaultAccounts };
export type { DefaultAccountOptions, DefaultAccountsRes, OtherProps };
