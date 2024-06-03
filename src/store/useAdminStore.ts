import { create } from "zustand";
import { CountryAccountsRes } from "../api/admin/useCountryAccount";
import { DefaultAccountsRes } from "../api/admin/useDefaultAccount";
import { AdminSettingsRes } from "../api/admin/useQuerySetting";

type AdminStoreOption = {
  setting: AdminSettingsRes | null;
  setSetting: (setting: AdminSettingsRes | null) => void;
  allAccounts: null | CountryAccountsRes;
  setAllAccounts: (allAccounts: CountryAccountsRes | null) => void;
  defaultAccounts: null | DefaultAccountsRes;
  setDefaultAccounts: (defaultAccounts: null | DefaultAccountsRes) => void;
};

const useAdminStore = create<AdminStoreOption>((set) => ({
  setting: null,
  setSetting: (setting) => set({ setting }),
  allAccounts: null,
  setAllAccounts: (allAccounts) => set({ allAccounts }),
  defaultAccounts: null,
  setDefaultAccounts: (defaultAccounts) => set({ defaultAccounts }),
}));

export { useAdminStore };
