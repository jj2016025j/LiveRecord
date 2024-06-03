import { Radio, Input } from "antd";

interface ISetCounterInputProps {
  value?: string | number;
  onChange?: (value: string | number) => void;
  setType: number;
  setSetType: React.Dispatch<React.SetStateAction<number>>;
}

const SetCounterInput: React.FunctionComponent<ISetCounterInputProps> = (
  // prettier-ignore
  { value, onChange, setType, setSetType }
) => {
  return (
    <>
      <Radio.Group
        value={setType}
        onChange={(e) => {
          setSetType(e.target.value);
          if (onChange) onChange("");
        }}
        options={[
          {
            label: "不設定",
            value: 1,
          },
          {
            label: "補入",
            value: 2,
          },
          {
            label: "取出",
            value: 3,
          },
        ]}
      />
      <Input
        placeholder="請輸入金額"
        autoComplete="off"
        disabled={setType === 1}
        value={value}
        onChange={(e) => {
          if (onChange) onChange(e.target.value);
        }}
      />
    </>
  );
};

export default SetCounterInput;
