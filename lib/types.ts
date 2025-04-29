import type { FieldProps } from "@src/components/FieldContext";
import type { Accessor, Component, ComponentProps, JSXElement, Setter, ValidComponent } from "solid-js";

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
    deleteField?: () => void
    deep?: number
}

export class FieldContextConfig implements IFieldContextConfig {
    constructor(
        name: Accessor<FieldName>,
        path: Accessor<FieldPath>,
        isArray: Accessor<boolean>,
        value: Accessor<any>,
        defaultValue: Accessor<any>,
        setValue?: Setter<any>,
        deleteField?: () => void,
        deep?: number) {
        this.name = name;
        this.path = path;
        this.isArray = isArray;
        this.value = value;
        this.defaultValue = defaultValue;
        this.setValue = setValue;
        this.deleteField = deleteField;
        this.deep = deep;
    }
    name: Accessor<FieldName>;
    path: Accessor<FieldPath>;
    isArray: Accessor<boolean>;
    value: Accessor<any>;
    defaultValue: Accessor<any>;
    setValue?: Setter<any> | undefined;
    deleteField?: (() => void) | undefined;
    deep?: number | undefined;
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

export interface FormControlProps<V, C extends ValueAccessibleComponent<V, ValueAccessor<V>> | ValidComponent, P extends ComponentProps<C>, K extends keyof P> {
    control?: C,
    controlProps?: ComponentProps<C>;
    controlValuePropName?: keyof ComponentProps<C>,
    onControlValueChanged?: {
        eventName: K,
        generateHandler: (setter?: Setter<V>) => P[K];
    }
    defaultValue?: V
}

export type FormListControlAddHandler = (value?: any, index?: number) => void;
export type FormListControlRemoveHandler = (index: number) => void;
export type FormListControlHandlers = { add: FormListControlAddHandler, remove: FormListControlRemoveHandler, clear: FormListControlClearHandler }
export type FormListControlClearHandler = () => void;

export interface FormListControlProps {
    children?: (fields: Accessor<FieldProps[]>, handlers: FormListControlHandlers) => JSXElement
}
export interface FormListProps extends FormListControlProps {
    name?: string,
}

export interface FormFieldProps<V, C extends ValueAccessibleComponent<V, ValueAccessor<V>> | ValidComponent, P extends ComponentProps<C>, K extends keyof P>
    extends FieldContextProviderProps<V>, FormControlProps<V, C, P, K> {
    children?: JSXElement
}

export interface IFormInstance {
    setValue: (value: any) => void,
    submit: () => void
    disabled: Accessor<boolean>
    readonly: Accessor<boolean>
}

export interface FormProps<V = any> extends ValueAccessor<V> {
    initialValue?: V
    disabled?: boolean
    readonly?: boolean
    onSubmit?: (value?: V) => void;
    onRef?: (form: IFormInstance) => void;
}

export interface FormCore<V> {
    instance: Accessor<IFormInstance>
    value: Accessor<V | undefined>
    setValue: Setter<V | undefined>
    root: Accessor<IFieldContextConfig<V>>
}
