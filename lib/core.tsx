import { createEffect, createMemo, createSignal, mergeProps, on } from "solid-js";
import { RootFieldName, type FormCore, type FormProps, type IFieldContextConfig, type IFormInstance } from "./types";

export const createFormCore = <V = any>(options?: FormProps<V>): FormCore<V> => {
  const mixed = mergeProps({ readonly: false, disabled: false }, options);
  const [value, setValue] = createSignal<V | undefined>(undefined);
  const form = createMemo(() => {
    const instance: IFormInstance = {
      submit: () => mixed.onSubmit?.(value()),
      disabled: () => mixed.disabled,
      readonly: () => mixed.readonly,
      setValue
    }

    return instance;
  })

  const root = createMemo(() => {
    const instance: IFieldContextConfig = {
      name: () => RootFieldName,
      path: () => [RootFieldName],
      isArray: () => false,
      value: value,
      setValue: setValue,
      defaultValue: () => undefined
    }

    return instance;
  })

  createEffect(() => setValue(mixed.value as any))
  createEffect(on(value, v => mixed.onValueChanged?.(v)))
  createEffect(on(form, v => mixed.onRef?.(v)))

  return {
    value,
    setValue,
    instance: form,
    root
  }
}
