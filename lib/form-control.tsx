import { createMemo, createRenderEffect, mergeProps, splitProps, type ComponentProps, type ValidComponent } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useFieldContext } from "./contexts";
import { type ValueAccessibleComponent, type ValueAccessor, type FormControlProps } from "./types";

const FormControl = <V, C extends ValueAccessibleComponent<V, ValueAccessor<V>> | ValidComponent, P extends ComponentProps<C>, K extends keyof P>(p: FormControlProps<V, C, P, K>) => {
  const props = mergeProps({ controlValuePropName: 'value' }, p)

  const context = useFieldContext();
  const controlProps = createMemo(() => {

    const valueAccessor: any = {
      [props.controlValuePropName]: context.value(),
    }

    if (props.onControlValueChanged) {
      valueAccessor[props.onControlValueChanged.eventName] = props.onControlValueChanged.generateHandler(context.setValue);
    }
    else {
      valueAccessor['onValueChanged'] = context.setValue
    }

    return {
      ...props.controlProps,
      ...valueAccessor
    }
  })

  createRenderEffect(() => {
    context?.setValue?.(prev => (props.controlProps?.[props.controlValuePropName] ?? props.defaultValue));
  })

  return <>
    {props.control && <Dynamic component={props.control} {...controlProps() as any}></Dynamic>}
  </>
}

export default FormControl
