import { createMemo } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useFieldContext } from "./contexts";
import { type ValueAccessibleComponent, type ValueAccessor, type FormControlProps } from "./types";

const FormControl = <V = any, C extends ValueAccessibleComponent<V, ValueAccessor<V>> = any>(props: FormControlProps<V, C>) => {
  const context = useFieldContext();
  const controlProps = createMemo(() => {

    const valueAccessor: ValueAccessor<any> = {
      value: context.value(),
      onValueChanged: context.setValue
    }

    return {
      ...props.controlProps,
      ...valueAccessor
    }
  })

  return <>
    {props.control && <Dynamic component={props.control} {...controlProps() as any}></Dynamic>}
  </>
}

export default FormControl
