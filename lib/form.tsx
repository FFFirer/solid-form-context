import { createEffect, createMemo, createSignal, mergeProps, on, type ParentComponent, type ParentProps, splitProps } from "solid-js";
import { type FormProps, type IFieldContextConfig, type IFormInstance, RootFieldName } from "./types";
import { FieldContext, FormContext } from "./contexts";
import { createFormCore } from "./core";

const Form = <V = any>(p: ParentProps<FormProps<V>>) => {

  const [local, props] = splitProps(mergeProps({ disabled: false, readonly: false }, p), ['children']);

  const core = createFormCore(props);

  return <FormContext.Provider value={core.instance()}>
    <FieldContext.Provider value={core.root()}>
      {local.children}
    </FieldContext.Provider>
  </FormContext.Provider>
}

export default Form
