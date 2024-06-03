import { UseTestMutationProps, useTestMutation } from '@/utils';
import { KycImgTypes } from './useKycImages';
import { axiosRoot } from '@/utils/axiosRoot';
import { UploadFile } from 'antd';
import { useRef } from 'react';

type UploadImgRes = {};
type UploadImgProps = {
  file: File;
  userId: string;
  imageType: KycImgTypes;
};
type OtherProps = {
  setWImgs: React.Dispatch<React.SetStateAction<Array<UploadFile>>>;
  wImgs: Array<UploadFile>;
};

const useUploadImg = (useProps: UseTestMutationProps<UploadImgRes, UploadImgProps, OtherProps>) => {
  const tempList = useRef<Array<UploadFile>>([]);
  // DOM
  const { setWImgs, wImgs, ...other } = useProps || {};
  const testMutation = useTestMutation<UploadImgRes, UploadImgProps>({
    ...other,
    mutationFn: async (props) => {
      tempList.current = wImgs;
      const { file, userId, imageType } = props;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('imageType', imageType);
      const request = axiosRoot.post('/kyc/upload', formData);
      return request;
    },
    onError: () => {
      setWImgs(tempList.current);
    }
  });

  return { ...testMutation };
};

export { useUploadImg };
export type { UploadImgRes, UploadImgProps };
