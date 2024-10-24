# solid-form-context

## Form

提供表单主要能力

## FormField

提供字段值访问能力

## FormControl

1. 提供字段值与空间的自动值绑定
2. 可扩展，仅需实现value属性及onValueChanged事件

## Contexts

### 1. FormContext

为Form内部提供统一的配置信息

### 2. FieldContext

递归获取字段值及自动收集变化
