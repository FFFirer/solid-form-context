import { Accessor, Component, createComputed, createContext, createMemo, ParentComponent, useContext } from "solid-js"

export type InternalNamePath = string | number

export interface FieldContextConfig {
    name: InternalNamePath
    path: InternalNamePath[]
    value: () => any,
    setValue: (value: any) => void
}

export const DefaultFieldContextConfig: FieldContextConfig = {
    name: '$',
    path: ['$'],
    value: () => undefined,
    setValue: (value: any) => { }
}

export const FieldContext = createContext(DefaultFieldContextConfig);

export const useFieldContext = () => {
    const context = useContext(FieldContext);

    return context
}

export const IsNotUndefinedOrNull = (obj?: any) => {
    return obj !== undefined && obj !== null
}

export const IsNotWhitespaceString = (obj?: string) => {
    return IsNotUndefinedOrNull(obj) && obj?.trim() !== '';
}

export const IsValidInternalNamePath = (path?: InternalNamePath) => {
    return IsNotUndefinedOrNull(path)
        && (typeof path === 'string'
            ? path.trim() !== ''
            : typeof path === 'number'
                ? path >= 0
                : false);
}

export interface FieldContextProviderProps {
    name?: InternalNamePath
    value?: any
    defaultValue?: any
}

export interface FieldProps {
    name?: InternalNamePath,
    value?: any,
    defaultValue?: any
    setValue?: (value: any) => void
}

export const IsObjectOrArrayAccessible = (obj: any) => {
    return IsNotUndefinedOrNull(obj) && (typeof obj === 'object' || Array.isArray(obj))
}

export const FieldContextProvider: ParentComponent<FieldContextProviderProps> = (props) => {
    const parentFieldContext = useFieldContext();

    const valid = createMemo(() => IsValidInternalNamePath(props.name))
    const parentValue = createMemo(() => parentFieldContext.value())

    const name = createMemo(() => valid() ? props.name! : parentFieldContext.name);
    const path = createMemo(() => valid() ? [...parentFieldContext.path, props.name!] : parentFieldContext.path)
    const value = createMemo(() => {
        if (valid()) {
            // 存在name, object/array
            if(IsNotUndefinedOrNull(parentValue())) {
                if (IsObjectOrArrayAccessible(parentValue())) {
                    return parentValue()?.[name()];
                }
                else {
                    console.warn('cannot get value', path(), 'expect a object or a array, but get', parentValue())
                }
            }
            return undefined;
        }
        else {
            return parentValue();
        }
    });
    const setValue = createMemo(() => {
        return (value: any) => {
            const nextValue = parentValue() ?? props.defaultValue;

            if (valid()) {
                // 存在name, 直接修改
                if (IsObjectOrArrayAccessible(nextValue)) {
                    nextValue[name()] = value;
                }
                else {
                    console.warn('cannot modify value', path(), 'current', nextValue, 'modified', value)
                }
            }
            else {
                parentFieldContext.setValue(value);
            }
        }
    })

    const nextContext = createMemo((parent) => {
        return {
            name: name(),
            path: path(),
            value,
            setValue
        }
    });

    return <FieldContext.Provider value={nextContext()}>{props.children}</FieldContext.Provider>
}

export const FieldTest: ParentComponent = (props) => {
    const current = useFieldContext();

    return <div style={{ border: '1px solid #eee', padding: '1rem' }}>
        <p>name:<strong>{current.name}</strong> value: {current.value()}</p>
        <p>path:<span>{JSON.stringify(current.path)}</span></p>
        {props.children}
    </div>
}