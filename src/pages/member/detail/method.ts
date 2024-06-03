import { useCallback } from 'react';
import { SendProps } from '../../../api/member/useSendKyc';
import { VerifyStatusNum } from '@/utils';
import { UploadFile } from 'antd';
import { Dayjs } from 'dayjs';
import { UpdateKycStatusProps } from '@/api/member';
import { axiosRoot } from '@/utils/axiosRoot';

type DetailFormSubmit = {
  idNumber: string;
  birth: Dayjs;
  contactAddress: string;
  email: string;
  idCardPhotos: Array<UploadFile<File>>;
  name: string;
  national: string;
  phone: string;
  residenceAddress: string;
  selfPhoto: Array<UploadFile<File>>;
  status: VerifyStatusNum;
  faileds: Array<string>;
};
// 將表單資訊轉換為Kyc提交的格式
const useHandleTransProps = (
  create: (props: SendProps) => void,
  originStatus: undefined | VerifyStatusNum,
  update: (props: UpdateKycStatusProps) => void,
  userId: string | undefined,
) => {
  const handleTrans = useCallback(
    async (origin: DetailFormSubmit) => {
      const { idNumber, birth, contactAddress, email, name, national, phone, residenceAddress, status } = origin;
      const { faileds } = origin;

      // === create ===
      if (originStatus === undefined) {
        const newProps: SendProps = {
          idNumber,
          realName: name,
          nationality: national,
          dateOfBirth: birth.format(),
          registeredAddress: residenceAddress,
          contactAddress,
          contactPhoneNumber: phone,
          email,
        };

        create(newProps);
      }

      // === update ===
      if (userId) {
        update({
          status,
          userId,
          faileds,
          originStatus,
        });
      }
    },
    [create, originStatus],
  );

  return handleTrans;
};

export { useHandleTransProps };
export type { DetailFormSubmit };
