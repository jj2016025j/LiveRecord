import {
  CountryKeyNum,
  myFactory,
  useTestMutation,
  UseTestMutationProps,
} from "../../utils";
import { axiosRoot } from "../../utils/axiosRoot";
import { TwAccountOptions } from "./useCountryAccount";

type CreateAccRes = {
  new: TwAccountOptions;
};
type CreateAccProps = {
  countryKey: CountryKeyNum;
  accountName: string;
  account: string;
  code: string;
  remark?: string;
};
type OtherProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const useCreateAcc = (
  // prettier-ignore
  { setOpen, ...useProps }: UseTestMutationProps<CreateAccRes, CreateAccProps, OtherProps>
) => {
  const testMutation = useTestMutation<CreateAccRes, CreateAccProps>({
    ...useProps,
    mutationFn: (props) => {
      const request = axiosRoot
        .post("/admin/acc/create", props)
        .then(({ data }) => data);
      return request;
    },
    onSuccess: () => {
      setOpen(false);
    },
    delay: 1000,
    onTest: () => {
      const makeData: CreateAccRes = {
        new: {
          id: myFactory.string.uuid(),
          accountName: myFactory.person.firstName(),
          bankName: myFactory.location.street().slice(0, -1) + "銀行",
          code: myFactory.string.alphanumeric({ length: 3 }),
          account: myFactory.string.alphanumeric({ length: 12 }),
        },
      };
      return Promise.resolve(makeData);
    },
  });

  return { ...testMutation };
};

export { useCreateAcc };
export type { CreateAccProps, CreateAccRes };
