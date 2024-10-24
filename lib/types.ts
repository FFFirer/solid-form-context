import { Accessor, Component, JSXElement, Setter, ValidComponent } from "solid-js";

export const RootFieldName = "$"

export type FieldName = string | number;
export type FieldPath = FieldName[];

export interface ValidationResult {
    success: boolean
}

export interface ValidationOption {

}

export type ValidationCallback = () => void

export type Validator<V> = (value?: V, options?: ValidationOption[], callback?: ValidationCallback) => ValidationResult

export interface IFieldContextConfig<V = any> {
    name: Accessor<FieldName>
    path: Accessor<FieldPath>
    isArray: Accessor<boolean>
    value: Accessor<V>
    defaultValue: Accessor<V>
    setValue?: Setter<V>
}

export class FieldContextConfig implements IFieldContextConfig {
    constructor(name: Accessor<FieldName>, path: Accessor<FieldPath>, isArray: Accessor<boolean>, value: Accessor<any>, defaultValue: Accessor<any>, setValue?: Setter<any>) {
        this.name = name;
        this.path = path;
        this.isArray = isArray;
        this.value = value;
        this.defaultValue = defaultValue;
        this.setValue = setValue;
    }
    name: Accessor<FieldName>;
    path: Accessor<FieldPath>;
    isArray: Accessor<boolean>;
    value: Accessor<any>;
    defaultValue: Accessor<any>;
    setValue?: Setter<any> | undefined;

}

export interface FieldContextProviderProps<V> extends ValueAccessor<V> {
    name?: FieldName
    defaultValue?: V
    isArray?: boolean
}

export interface ValueAccessor<V> {
    value?: V
    onValueChanged?: (value?: V) => void
}

export type ValueAccessibleComponent<V, P extends ValueAccessor<V>> = Component<P> & ValidComponent

export interface FormControlProps<V, C extends ValueAccessibleComponent<V, ValueAccessor<V>>> {
    control?: C,
    controlProps?: C extends (props: infer P) => JSXElement ? P : {};
}

export interface FieldProps<V, C extends ValueAccessibleComponent<V, ValueAccessor<V>>> 
    extends FieldContextProviderProps<V>, FormControlProps<V, C> {
    children?: JSXElement
}

export interface IFormInstance {
    setValue: (value: any) => void,
    submit: () => void
    disabled: Accessor<boolean>
    readonly: Accessor<boolean>
}

export interface FormOptions {
    initialValue?: any
    disabled?: boolean
    readonly?: boolean
    onSubmit?: (value: any) => void;
    onRef?: (form: IFormInstance) => void;
}
