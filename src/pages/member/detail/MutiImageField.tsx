import { KycImgTypes, useUploadImg } from '@/api/member';
import AntImage from '@/components/AntImage';
import { compression, drawWaterMark } from '@/utils';
import { PlusSquareFilled } from '@ant-design/icons';
import { Button, Image, Modal, Space, Upload, UploadFile } from 'antd';
import { useEffect, useState } from 'react';

interface IMutiImageFieldProps {
  maxSize?: number;
  isPending?: boolean;
  names?: Array<KycImgTypes>;
  userId: string | undefined;
  preViews?: Array<string | undefined>;
}

const MutiImageField: React.FunctionComponent<IMutiImageFieldProps> = (props) => {
  const { maxSize, isPending, names, userId, preViews } = props || {};
  const [wImgs, setWImgs] = useState<Array<UploadFile>>([]);
  const [previewFile, setPreviewFile] = useState<string>();
  // mutation
  const { mutate: upload } = useUploadImg({ setWImgs, wImgs });

  // Upload preview
  useEffect(() => {
    const validPreviews = preViews?.filter((view) => !!view) as Array<string>;
    if (!validPreviews?.length) return;
    const newImgs: Array<UploadFile> = validPreviews.map((view) => {
      const img: UploadFile = {
        uid: view,
        name: view,
      };
      return img;
    });
    setWImgs(newImgs);
  }, [preViews]);

  const handleOnRemove = (file: UploadFile) => {
    setWImgs((pre) => {
      const indexOfList = pre.findIndex((data) => data.uid === file.uid);
      pre.splice(indexOfList, 1);
      return [...pre];
    });
  };

  return (
    <>
      <Space style={{ alignItems: 'center' }}>
        {wImgs.map((img, index) => {
          return (
            <AntImage
              key={`${img.name}${index}}`}
              onDel={() => handleOnRemove(img)}
              src={img.name}
              style={{ marginRight: 10 }}
            />
          );
        })}
        <Upload
          showUploadList={{
            removeIcon: isPending ? false : undefined,
            previewIcon: isPending ? false : undefined,
          }}
          {...{ fileList: [] }}
          listType='picture-circle'
          beforeUpload={async (file) => {
            const { beanImg, beanFile } = (await compression({ file: file, sizeLog: true })) || {};
            const name = names?.at(wImgs.length - 1);
            if (!beanFile || !name || !userId) return false;

            const { wImg } = (await drawWaterMark(beanFile)) || {};
            if (wImg)
              setWImgs((pre) => {
                console.warn('on use water');
                const imageData: UploadFile = {
                  uid: wImg,
                  name: wImg,
                };
                const imgs = pre.concat([imageData]);
                return [...imgs];
              });
            else if (beanImg) {
              console.warn('on use bean');
              setWImgs((pre) => {
                const imageData: UploadFile = {
                  uid: beanImg,
                  name: beanImg,
                };
                const imgs = pre.concat([imageData]);
                return [...imgs];
              });
            }

            upload({
              file: beanFile,
              imageType: name,
              userId,
            });
            return false;
          }}
        >
          {(maxSize ?? 2) > (wImgs?.length ?? 0) && (
            <Button
              type='link'
              style={{ padding: 0, width: '100%', height: '100%' }}
            >
              <PlusSquareFilled style={{ fontSize: 24 }} />
            </Button>
          )}
        </Upload>
      </Space>

      <Modal
        open={!!previewFile}
        closable={false}
        footer={null}
        width='95%'
        onCancel={() => setPreviewFile(undefined)}
      >
        <Image
          src={previewFile}
          preview={false}
        />
      </Modal>
    </>
  );
};

export default MutiImageField;
