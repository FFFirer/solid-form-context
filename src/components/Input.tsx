import { type Component, type JSX, splitProps } from "solid-js";
import type { ValueAccessor } from "../../lib";

const Input: Component<
  ValueAccessor<any> &
    Omit<
      JSX.InputHTMLAttributes<HTMLInputElement>,
      "value" | "onchange" | "onChange"
    >
> = (props) => {
  const [local, elProps] = splitProps(props, ["value", "onValueChanged"]);
  const handleChanged: JSX.InputHTMLAttributes<HTMLInputElement>["onChange"] = (
    e
  ) => {
    local.onValueChanged?.(e.target.value);
  };
  return (
    <input
      {...props}
      value={local.value ?? null}
      onChange={handleChanged}
    ></input>
  );
};

export default Input;
