import { Card, Dropdown, Space, SpaceProps } from "antd";
import { useEffect, useRef, useState } from "react";

type TimeOptions = {
  minutes: number | undefined;
  hours: number | undefined;
};

interface ITimeSelectorProps {
  value?: TimeOptions;
  onChange?: (newTime?: TimeOptions) => void;
  disabled?: boolean;
}

const TimeSelector: React.FunctionComponent<ITimeSelectorProps & SpaceProps> = (
  // prettier-ignore
  { onChange, value, disabled , ...props}
) => {
  const [originTime, setOriginTime] = useState<TimeOptions>();

  useEffect(() => {
    if (
      !onChange ||
      originTime?.minutes === undefined ||
      originTime?.hours === undefined
    )
      return;
    onChange(originTime);
  }, [originTime, onChange]);

  const isInit = useRef(false);
  useEffect(() => {
    if (isInit.current || !value) return;
    isInit.current = true;
    setOriginTime(value);
  }, [value]);

  return (
    <>
      <Space {...props} style={{ ...props.style, paddingInline: 10 }}>
        <Dropdown
          {...{ disabled }}
          menu={{
            items: Array(24)
              .fill(null)
              .map((_, index) => {
                return {
                  key: index,
                  label: (
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        if (originTime) {
                          setOriginTime({ ...originTime, hours: index });
                        } else {
                          setOriginTime({ minutes: 0, hours: index });
                        }
                      }}
                    >
                      {index.toString().padStart(2, "0")}
                    </a>
                  ),
                };
              }),
          }}
          dropdownRender={(originNode) => {
            return (
              <Card
                styles={{
                  body: {
                    height: 200,
                    overflowY: "scroll",
                    overflowX: "hidden",
                    padding: 0,
                  },
                }}
              >
                {originNode}
              </Card>
            );
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            {originTime?.hours !== undefined
              ? originTime?.hours.toString().padStart(2, "0")
              : "時"}
          </a>
        </Dropdown>
        :
        <Dropdown
          {...{ disabled }}
          menu={{
            items: Array(60)
              .fill(null)
              .map((_, index) => {
                return {
                  key: index,
                  label: (
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        if (originTime) {
                          setOriginTime({ ...originTime, minutes: index });
                        } else {
                          setOriginTime({ hours: undefined, minutes: index });
                        }
                      }}
                    >
                      {index.toString().padStart(2, "0")}
                    </a>
                  ),
                };
              }),
          }}
          dropdownRender={(originNode) => {
            return (
              <Card
                styles={{
                  body: {
                    height: 200,
                    overflowY: "scroll",
                    overflowX: "hidden",
                    padding: 0,
                  },
                }}
              >
                {originNode}
              </Card>
            );
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            {originTime?.minutes !== undefined
              ? originTime?.minutes.toString().padStart(2, "0")
              : "分"}
          </a>
        </Dropdown>
      </Space>
    </>
  );
};

export default TimeSelector;
export type { TimeOptions };
