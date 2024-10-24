import { createMemo } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useFieldContext } from "./context";
import { ValueAccessibleComponent, ValueAccessor, FormControlProps } from "./types";

const FormControl = <V = any, C extends ValueAccessibleComponent<V, ValueAccessor<V>> = any>(props: FormControlProps<V, C>) => {
    const context = useFieldContext();
    const controlProps = createMemo(() => {
        return {
            ...props.controlProps,
            value: context.value(),
            onChange: context.setValue
        }
    })

    return <>
        {props.control && <Dynamic component={props.control} {...controlProps() as any}></Dynamic>}
    </>
}

export default FormControl