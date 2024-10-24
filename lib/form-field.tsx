import { createMemo, splitProps, useContext } from "solid-js";
import { FieldProps, ValueAccessibleComponent, ValueAccessor } from "./types";
import { FieldContextProvider, useFormContext } from "./contexts";
import FormControl from "./form-control";
import utils from "./utils";

const FormField = <V, C extends ValueAccessibleComponent<V, ValueAccessor<V>>>(props: FieldProps<V, C>) => {
  const [local, field] = splitProps(props, ['control', 'controlProps', 'children'])
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
    <FormControl control={local.control} controlProps={controlProps()}></FormControl>
    {local.children}
  </FieldContextProvider>
}

export default FormField
