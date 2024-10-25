# solid-form-context

## Form

定义一个表单的范围，提供设置表单对象值，提交表单的方法

## FormField

定义一个表单字段，如果设置了一个控件，则自动管理控件值的获取及更新；如果没有设置字段，则可以为内部的FormField提供上一级的数据。

> 只有当FormField的`name`设置为有效的字符串或者数字时才视为一个有效的字段，否则仅传递字段值的获取与更新

## FormControl

1. 提供字段值与控件的自动值绑定
2. 可扩展，默认情况下仅需实现`value`属性及`onValueChanged`事件，`value`提供值的获取，`onValueChanged`提供值得更新
3. 值属性名称非`value`，使用`controlValuePropName`指定要设置值的属性
4. 当控件无`onValueChanged`事件时，设置`onControlValueChanegd`以指定当指定事件发生时如何处理值的更新
5. 以上`3`和`4`点`FormField`控件同样支持，因为内部也是使用`FormControl`控件实现，会透传对应props

## Contexts

### 1. FormContext

为Form内部提供统一的配置信息，目前只提供最基础的submit功能

### 2. FieldContext

定义一个字段的范围，提供从范围中获取值与设置值的能力，并自动手机到最顶层的Form内
