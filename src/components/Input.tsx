import { Component, JSX, splitProps } from "solid-js";
import { ValueAccessor } from "../../lib";

const Input: Component<ValueAccessor<any> & Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onchange' | 'onChange'>> = (props) => {
    const [local, elProps] = splitProps(props, ['value', 'onChange'])
    const handleChanged: JSX.InputHTMLAttributes<HTMLInputElement>['onChange'] = e => {
        local.onChange?.(e.target.value)
    }
    return <input {...props} value={local.value} onChange={handleChanged}></input>
}

export default Input