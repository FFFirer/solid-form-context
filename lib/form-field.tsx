import { createMemo, splitProps } from "solid-js";
import { FieldProps, ValueAccessibleComponent, ValueAccessor } from "./types";
import { FieldContextProvider } from "./context";
import FormControl from "./form-control";
import utils from "./utils";

const FormField = <V, C extends ValueAccessibleComponent<V, ValueAccessor<V>>>(props: FieldProps<V, C>) => {
    const [local, field] = splitProps(props, ['control', 'controlProps', 'children'])

    const controlProps = createMemo(() => {
        const ctrlProps : Record<string, any> = { }

        if (utils.IsValidFieldName(field.name)) {
            ctrlProps['name'] = field.name
        }

        return {
            ...ctrlProps,
            ...local.controlProps
        } as any
    })

    return <FieldContextProvider {...field}>
        <FormControl control={local.control} controlProps={controlProps()}></FormControl>
        {local.children}
    </FieldContextProvider>
}

export default FormField