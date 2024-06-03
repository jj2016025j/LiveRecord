import { FormInstance } from 'antd';
import dayjs from 'dayjs';
import { CountryKeyNum, countryOptions, useTestQuery, UseTestQueryProps, VerifyStatusNum } from '../../utils';
import { axiosRoot } from '../../utils/axiosRoot';
import { useState } from 'react';

// types
type KycDetail = {
  idNumber: string;
  realName: string;
  nationality: CountryKeyNum;
  dateOfBirth: string;
  contactPhoneNumber: string;
  email: string;
  registeredAddress: string;
  contactAddress: string;
  kycVerifyStatus: VerifyStatusNum;
  failedValidationFields: string[];
  count: number;
};
type DetailProps = {
  userId: string;
};
type OtherProps = {
  form: FormInstance;
  setVerifyStatus: React.Dispatch<React.SetStateAction<VerifyStatusNum | undefined>>;
};

const useKycDetail = (
  // prettier-ignore
  { params, form, setVerifyStatus, ...useProps }: UseTestQueryProps<OtherProps, DetailProps>,
) => {
  const [detail, setDetail] = useState<KycDetail>();
  const testMutation = useTestQuery<KycDetail, DetailProps>({
    ...useProps,
    queryKey: ['kyc', 'detail', params?.userId],
    qf: () => {
      const request = axiosRoot.post('/kyc/getByUserId', { ...params }).then(({ data }) => data);
      return request;
    },
    onSuccess: (data) => {
      setDetail(data);
      if (!form) return;
      const { idNumber, nationality, contactAddress, contactPhoneNumber, email, kycVerifyStatus, dateOfBirth } = data;
      const { realName, registeredAddress } = data;

      form.setFieldsValue({
        name: realName,
        idNumber,
        national: countryOptions.find((option) => option.value === nationality)?.label,
        birth: dayjs(dateOfBirth),
        phone: contactPhoneNumber,
        email,
        residenceAddress: registeredAddress,
        contactAddress,
      });
      setVerifyStatus(kycVerifyStatus);
    },
    skipLog: true,
  });

  return { ...testMutation, detail, setDetail };
};

export { useKycDetail };
export type { KycDetail, DetailProps };
