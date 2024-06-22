import { useEffect, useRef } from 'react';
import styles from './styles.module.scss';

interface IFallbackLoadingProps {}

const FallbackLoading: React.FunctionComponent<IFallbackLoadingProps> = (props) => {
  const {} = props || {};

  const boxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const boxCurrent = boxRef.current;
    if (!boxCurrent) return;

    boxCurrent.classList.remove(styles.leave);
    boxCurrent.classList.add(styles.visible);
    return () => {
      boxCurrent.classList.remove(styles.visible);
    };
  }, []);

  return (
    <>
      <div
        ref={boxRef}
        className={`${styles.box}`}
      >
        <div className={styles.container}>Loading</div>
      </div>
    </>
  );
};

export default FallbackLoading;
