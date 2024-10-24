import { Component, createMemo, Index } from "solid-js";
import { FieldContextProvider, FormField, useFieldContext } from "../../lib";
import { Border } from "./FieldContext";
import Input from "./Input";

export const FieldList2: Component = (props) => {

    const context = useFieldContext();
    const value = createMemo(() => {
        return context.value() ?? []
    })

    const updateItemValue = (value: any, index: number) => {
        const current = value();
        current[index] = value;
        context.setValue?.([...current])
    }

    const add = () => {
        const nextValue = [...value(), '']
        context.setValue?.(nextValue);
    }

    const remove = (index: number) => {
        const nextValue = value().filter((_: any, i: number) => i !== index);
        context.setValue?.(nextValue);
    }

    return <Border>
        <Border>
            <button type="button" onclick={() => add()}>add</button>
        </Border>
        <Index each={value()}>
            {(item, index) => <div>
                <FormField name={index} control={Input} controlProps={{ placeholder: `index-${index}` }}>
                    <button type="button" onclick={() => remove(index)}>remove</button>
                </FormField>
            </div>}
        </Index>
    </Border>
}