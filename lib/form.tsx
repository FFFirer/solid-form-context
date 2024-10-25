import { createEffect, createMemo, createSignal, mergeProps, on, type ParentComponent, type ParentProps, splitProps } from "solid-js";
import { type FormProps, type IFieldContextConfig, type IFormInstance, RootFieldName } from "./types";
import { FieldContext, FormContext } from "./contexts";

const Form = <V = any>(p: ParentProps<FormProps<V>>) => {

  const [local, props] = splitProps(mergeProps({ disabled: false, readonly: false }, p), ['children']);

  const [value, setValue] = createSignal<V | undefined>(props.initialValue);

  const form = createMemo(() => {
    const instance: IFormInstance = {
      submit() {
        props.onSubmit?.(value());
      },
      disabled: () => props.disabled,
      readonly: () => props.readonly,
      setValue
    }

    return instance;
  })

  createEffect(() => setValue(props.value as any))
  createEffect(on(value, v => props.onValueChanged?.(v)))
  createEffect(on(form, v => props.onRef?.(v)))

  const field = createMemo(() => {
    const instance: IFieldContextConfig = {
      name: () => RootFieldName,
      path: () => [RootFieldName],
      isArray: () => false,
      value: value,
      setValue: setValue,
      defaultValue: () => { },
    };
    return instance;
  })

  return <FormContext.Provider value={form()}>
    <FieldContext.Provider value={field()}>
      {local.children}
    </FieldContext.Provider>
  </FormContext.Provider>
}

export default Form
