import { Spin } from "antd";
import { useEffect, useRef } from "react";

interface ILoadingMaskProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
  isLoading: boolean;
}

const LoadingMask: React.FunctionComponent<
  ILoadingMaskProps & React.Attributes
> = (
  // prettier-ignore
  { style, children, isLoading, ...props }
) => {
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const maskCurrent = maskRef.current;
    if (!maskCurrent) return;

    if (isLoading) {
      maskCurrent.style.visibility = "visible";
    } else {
      setTimeout(() => {
        maskCurrent.style.visibility = "hidden";
      }, 400);
    }
  }, [isLoading]);

  return (
    <div style={{ position: "relative", ...style }} {...props}>
      {children}
      <div
        ref={maskRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transition: "opacity 0.2s",
          opacity: isLoading ? 0.7 : 0,
          visibility: "visible",
          width: "100%",
          height: "100%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          backgroundColor: "rgba(50, 50, 50, 0.2)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    </div>
  );
};

export default LoadingMask;
