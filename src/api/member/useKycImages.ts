import { UseTestQueryProps, bTof, drawWaterMark, forage, forageKeys, useTestQuery } from '@/utils';
import { axiosRoot } from '@/utils/axiosRoot';
import axios, { AxiosError } from 'axios';
import { LoginRes } from '../useLogin';
import { useRef, useState } from 'react';

type KycImgTypes = 'ID_Front' | 'ID_Back' | 'ID_Holder';
type KycImagesRes = [KycImgTypes | undefined, KycImgTypes | undefined, KycImgTypes | undefined]; // ID_Front , ID_Back , ID_Holder
type KycImagesProps = {};
type OtherProps = {
  id: string | undefined;
  onTestDraw?: boolean;
};

const useKycImages = (useProps: UseTestQueryProps<OtherProps, KycImagesRes>) => {
  const { id, onTestDraw, ...other } = useProps;
  const tryTimes = useRef(0);
  const [frontImg, setFrontImg] = useState<string>();
  const [backImg, setBackImg] = useState<string>();
  const [holdImg, setHoldImg] = useState<string>();
  const { refetch, ...testQuery } = useTestQuery<KycImagesRes, KycImagesProps>({
    ...other,
    queryKey: ['kyc', 'images', id ?? ''],
    qf: () => {
      const request = axiosRoot.get('/kyc/images/' + id).then(({ data }) => data);
      return request;
    },
    onSuccess: (res) => {
      if (tryTimes.current > 10 || (import.meta.env.DEV && onTestDraw)) return;
      forage().getItem<LoginRes>(forageKeys.auth, async (_, auth) => {
        if (!auth || !Array.isArray(res)) return;
        const queryArray: Array<string> = [];
        let requestTimes = 0;
        while (queryArray.length < res.length && requestTimes < 5) {
          const queryHost = res.filter((host) => !!host && !queryArray.includes(host)).at(0);
          if (!queryHost) return;
          requestTimes += 1;
          queryArray.push(queryHost);
          await axios
            .get<Blob>(queryHost, { responseType: 'blob' })
            .then(async ({ data }) => {
              const file = await bTof(data);
              const { wImg } = (await drawWaterMark(file)) || {};
              if (wImg) {
                if (queryHost.includes('ID_Front')) setFrontImg(wImg);
                if (queryHost.includes('ID_Back')) setBackImg(wImg);
                if (queryHost.includes('ID_Holder')) setHoldImg(wImg);
              }
            })
            .catch((e) => {
              console.log('on error', e);
              tryTimes.current += 1;
              const mikeError: AxiosError<IMikeError> = e;
              if (mikeError.response?.status === 403) {
                res.forEach(() => queryArray.push(''));
                refetch();
              }
            })
            .finally(() => {
              console.log('finally');
            });
        }
      });
    },
    enabled: !!id,
    skipLog: true,
  });

  return { ...testQuery, frontImg, backImg, holdImg, refetch };
};

export { useKycImages };
export type { KycImagesRes, KycImagesProps, KycImgTypes };
