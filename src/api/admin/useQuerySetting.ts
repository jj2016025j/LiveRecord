/**
 * 用於處裡Admin進入後台後取得相關的基本資料
 * TODO:
 * 1. 各個地區的帳戶資訊
 * 2. 各個店面預設使用的銀行帳號
 * 3. Admin 後台的設定資訊
 */

import { useAdminStore } from "../../store";
import { useTestQuery, UseTestQueryProps } from "../../utils";
import { axiosRoot } from "../../utils/axiosRoot";
import { useCountryAccount } from "./useCountryAccount";
import { useDefaultAccounts } from "./useDefaultAccount";

type OtherProps = {};

type AdminSettingsRes = {};
type UseQuerySettingProps = {
  adminID: string | undefined;
};

const useQuerySetting = (
  // prettier-ignore
  { params, isTest, enabled,}: UseTestQueryProps<OtherProps, UseQuerySettingProps>
) => {
  const { setSetting } = useAdminStore();

  const { data: countryAccounts } = useCountryAccount({ isTest, enabled });
  const { data: defaultAccounts } = useDefaultAccounts({
    isTest,
    enabled: !!countryAccounts,
  });
  useTestQuery<AdminSettingsRes>({
    queryKey: ["admin", "setting", params?.adminID],
    qf: () => {
      const request = axiosRoot
        .get("/admin/setting", { params })
        .then(({ data }) => data);
      return request;
    },
    onSuccess: (res) => {
      setSetting(res);
    },
    enabled: !!defaultAccounts && !!params?.adminID,
    isTest,
    delay: 1000,
    onTest: () => {
      return Promise.resolve({});
    },
  });
};

export { useQuerySetting };
export type { AdminSettingsRes, UseQuerySettingProps };
