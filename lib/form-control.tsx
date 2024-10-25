import { createMemo, mergeProps, splitProps, type ComponentProps, type ValidComponent } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useFieldContext } from "./contexts";
import { type ValueAccessibleComponent, type ValueAccessor, type FormControlProps } from "./types";

const FormControl = <V = any, C extends ValueAccessibleComponent<V, ValueAccessor<V>> | ValidComponent = any, P extends ComponentProps<C> = any, K extends keyof P = any>(p: FormControlProps<V, C, P, K>) => {
  const props = mergeProps({ controlValuePropName: 'value' }, p)

  const context = useFieldContext();
  const controlProps = createMemo(() => {

    const valueAccessor: any = {
      [props.controlValuePropName]: context.value(),
      onValueChanged: context.setValue
    }

    if(props.onControlValueChanged) {
      valueAccessor[props.onControlValueChanged.eventName] = props.onControlValueChanged.generateHandler(context.setValue);
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
