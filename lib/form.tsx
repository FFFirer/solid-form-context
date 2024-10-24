import { createEffect, createMemo, createSignal, mergeProps, on, ParentComponent, splitProps } from "solid-js";
import { FormOptions, IFieldContextConfig, IFormInstance, RootFieldName } from "./types";
import { FieldContext, FormContext } from "./contexts";

const Form: ParentComponent<FormOptions> = (p) => {
    const [local, props] = splitProps(mergeProps({ disabled: false, readonly: false }, p), ['children']);

    const [value, setValue] = createSignal(props.initialValue);

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