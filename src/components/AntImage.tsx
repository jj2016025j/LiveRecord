import { Button, Image, ImageProps } from 'antd';
import styles from './AntImage.module.scss';
import { LuView } from 'react-icons/lu';
import { MdDelete } from 'react-icons/md';
import { useState } from 'react';

interface IAntImageProps extends ImageProps {
  boxProps?: React.HtmlHTMLAttributes<HTMLDivElement>;
  onDel?: () => void;
}

const AntImage: React.FunctionComponent<IAntImageProps> = (props) => {
  const { boxProps, onDel, ...imageProps } = props || {};
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div
        {...{
          ...boxProps,
          className: `${styles['box']} ${boxProps?.className}`,
        }}
      >
        <img src={imageProps.src} />
        <div className={styles['funs']}>
          <Button
            className='col'
            shape='circle'
            icon={<LuView style={{ color: 'blue' }} />}
            type='text'
            onClick={() => setVisible(true)}
          />
          <Button
            className='col'
            shape='circle'
            icon={<MdDelete />}
            danger
            type='text'
            onClick={() => {
              if (onDel) onDel();
            }}
          />
        </div>
      </div>
      <Image
        {...{
          preview: {
            visible,
            scaleStep: 0.8,
            src: imageProps.src,
            onVisibleChange: (value) => {
              setVisible(value);
            },
          },
          ...imageProps,
          style: {
            ...imageProps.style,
            display: 'none',
          },
        }}
      />
    </>
  );
};

export default AntImage;
