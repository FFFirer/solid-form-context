import { createMemo, splitProps, useContext, type ComponentProps, type ValidComponent } from "solid-js";
import type { FieldProps, ValueAccessibleComponent, ValueAccessor } from "./types";
import { FieldContextProvider, useFormContext } from "./contexts";
import FormControl from "./form-control";
import utils from "./utils";

const FormField = <V, C extends ValueAccessibleComponent<V, ValueAccessor<V>> | ValidComponent, P extends ComponentProps<C>, K extends keyof P>(props: FieldProps<V, C, P, K>) => {
  const [local, field] = splitProps(props, ['control', 'controlProps', 'controlValuePropName', 'onControlValueChanged', 'children'])
  const form = useFormContext();

  const controlProps = createMemo(() => {
    const ctrlProps: Record<string, any> = {}

    if (utils.IsValidFieldName(field.name)) {
      ctrlProps['name'] = field.name
    }

    return {
      ...ctrlProps,
      ...local.controlProps,
      disabled: form?.disabled(),
      readonly: form?.readonly()
    } as any
  })

  return <FieldContextProvider {...field}>
    <FormControl
      control={local.control}
      controlProps={controlProps()}
      controlValuePropName={local.controlValuePropName}
      onControlValueChanged={local.onControlValueChanged}>
    </FormControl>
    {local.children}
  </FieldContextProvider>
}

export default FormField
