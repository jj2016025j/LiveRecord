import { DetailFormSubmit } from '@/pages/member/detail/method';
import { UseTestMutationProps, VerifyStatusNum, useTestMutation } from '@/utils';
import { axiosRoot } from '@/utils/axiosRoot';
import React, { useRef } from 'react';
import { KycDetail } from './useKycDetail';

type UpdateKycStatusRes = {};
type UpdateKycStatusProps = {
  status: VerifyStatusNum;
  userId: string;
  faileds?: Array<string>;
  originStatus: undefined | VerifyStatusNum;
};
type Other = {
  setSubmitDatas: React.Dispatch<React.SetStateAction<DetailFormSubmit | undefined>>;
  setDetail: React.Dispatch<React.SetStateAction<KycDetail | undefined>>;
};

const useUpdateKycStatus = (useProps: UseTestMutationProps<UpdateKycStatusRes, UpdateKycStatusProps, Other>) => {
  const { setSubmitDatas, setDetail, ...config } = useProps;
  const tempStatus = useRef<VerifyStatusNum>(); // 失敗時將原本的狀態返回

  const testMutation = useTestMutation({
    ...config,
    mutationFn: (props) => {
      const { status, userId, faileds, originStatus } = props;
      const validFields = faileds?.filter((failed) => !!failed);

      tempStatus.current = status;
      // 手動將三個API組合
      if (status === VerifyStatusNum.Verifing) {
        const request = axiosRoot.post('/kyc/kycPending', { userId }).then(({ data }) => data);
        return request;
      }
      if (status === VerifyStatusNum.Pass) {
        const request = axiosRoot.post('/kyc/kycVerified', { userId }).then(({ data }) => data);
        return request;
      }
      if (status === VerifyStatusNum.Fail) {
        // 僅設定失敗原因
        if (originStatus === status) {
          if (validFields?.length) {
            const request = axiosRoot
              .post('/kyc/failedFields', {
                userId: props.userId,
                kycFailedFields: validFields,
              })
              .then(({ data }) => data);
            return request;
          }
          return Promise.resolve({});
        }
        const request = axiosRoot.post('/kyc/kycRejected', { userId }).then(({ data }) => {
          // 設定失敗原因
          if (validFields?.length)
            axiosRoot.post('/kyc/failedFields', {
              userId: props.userId,
              kycFailedFields: validFields,
            });
          return data;
        });
        return request;
      }

      return Promise.resolve({});
    },
    onSuccess: () => {
      setDetail((pre) => {
        if (!pre || tempStatus.current === undefined) return undefined;
        const newData: KycDetail = {
          ...pre,
          kycVerifyStatus: tempStatus.current,
        };
        return newData;
      });
      setSubmitDatas(undefined);
    },
  });

  return { ...testMutation };
};

export { useUpdateKycStatus };
export type { UpdateKycStatusRes, UpdateKycStatusProps };
