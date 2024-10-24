import { Accessor, Component, createComputed, createContext, createMemo, Index, JSX, JSXElement, mergeProps, ParentComponent, splitProps, useContext } from "solid-js"

export type InternalNamePath = string | number

export interface FieldContextConfig {
    name: InternalNamePath
    path: InternalNamePath[]
    value: () => any,
    defaultValue: () => any,
    setValue: (value: any) => void
}

export const DefaultFieldContextConfig: FieldContextConfig = {
    name: '$',
    path: ['$'],
    value: () => undefined,
    defaultValue: () => undefined,
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
    onChange?: (value: any) => void
    isArray?: boolean
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

const refactor = (obj: any) => {
    if (IsNotUndefinedOrNull(obj)) {
        if (Array.isArray(obj)) {
            return [...obj];
        }
        else if (typeof obj === 'object') {
            return {
                ...obj
            }
        }
    }

    return obj
}

export const FieldContextProvider: ParentComponent<FieldContextProviderProps> = (props) => {

    const parentFieldContext = useFieldContext();

    const valid = createMemo(() => IsValidInternalNamePath(props.name))
    const parentValue = createMemo(() => parentFieldContext.value())
    const parentDefaultValue = createMemo(() => parentFieldContext.defaultValue() ?? valid() ? undefined : props.defaultValue)
    const defaultValue = createMemo(() => props.defaultValue)

    const name = createMemo(() => valid() ? props.name! : parentFieldContext.name);
    const path = createMemo(() => valid() ? [...parentFieldContext.path, props.name!] : parentFieldContext.path)
    const value = createMemo(() => {
        if (valid()) {
            // 存在name, object/array
            if (IsNotUndefinedOrNull(parentValue())) {
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
            return path().length > 1 ? parentValue() : props.value;
        }
    });
    const setValue = createMemo(() => {
        return (value: any) => {
            const nextValue = parentValue() ?? parentDefaultValue();

            console.log('value changed', path(), value);

            if (valid()) {
                // 存在name, 直接修改
                if (IsObjectOrArrayAccessible(nextValue)) {
                    nextValue[name()] = value;

                    const refactored = refactor(nextValue)

                    parentFieldContext.setValue(refactored);
                    props.onChange?.(refactored);
                }
                else if (!props.isArray) {
                    const newValue = {
                        [name()]: value
                    }

                    parentFieldContext.setValue(newValue);
                    props.onChange?.(newValue);
                }
                else {

                    console.warn('cannot modify value', path(), 'current', nextValue, 'modified', value)
                }
            }
            else {
                props.onChange?.(value);
                parentFieldContext.setValue(value);
            }
        }
    })

    const nextContext = createMemo((parent) => {
        return {
            name: name(),
            path: path(),
            value,
            setValue: setValue(),
            defaultValue
        }
    });

    return <FieldContext.Provider value={nextContext()}>{props.children}</FieldContext.Provider>
}

export const FieldInput: ParentComponent<JSX.InputHTMLAttributes<HTMLInputElement>> = (props) => {
    const [local, elProps] = splitProps(props, ['children'])

    const context = useFieldContext();
    const handleInput: JSX.InputHTMLAttributes<HTMLInputElement>['oninput'] = (e) => {
        console.log('input value', e.target.value);
        context.setValue(e.target.value)
    }

    return <div style={{ border: '1px solid #eee', padding: '1rem' }}>
        <input {...elProps} value={context.value()} oninput={handleInput}></input>
        {local.children}
    </div>
}

export const Border: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
    return <div style={{ border: '1px solid #eee', padding: '1rem' }} {...props}></div>
}

export const FieldTest: ParentComponent = (props) => {
    const current = useFieldContext();

    const display = createMemo(() => {
        const value = current.value();
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        else {
            return value;
        }
    })

    return <div style={{ border: '1px solid #eee', padding: '1rem' }}>
        <p>name:<strong>{current.name}</strong> value: {display()}</p>
        <p>path:<span>{JSON.stringify(current.path)}</span></p>
        {props.children}
    </div>
}

export interface FieldListProps {
    children: ({})
}

export const FieldList: Component = (props) => {

    const context = useFieldContext();
    const value = createMemo(() => {
        return context.value() ?? []
    })

    const updateItemValue = (value: any, index: number) => {
        const current = value();
        current[index] = value;
        context.setValue([...current])
    }

    const add = () => {
        const nextValue = [...value(), '']
        context.setValue(nextValue);
    }

    const remove = (index: number) => {
        const nextValue = value().filter((_: any, i: number) => i !== index);
        context.setValue(nextValue);
    }

    return <Border>
        <Border>
            <button type="button" onclick={() => add()}>add</button>
        </Border>
        <Index each={value()}>
            {(item, index) => <FieldContextProvider name={index}>
                <FieldInput placeholder={`index-${index}`}>
                    <button type="button" onclick={() => remove(index)}>remove</button>
                </FieldInput>
            </FieldContextProvider>}
        </Index>
    </Border>
}