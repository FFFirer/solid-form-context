import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  on,
  type ParentProps,
  splitProps,
  useContext,
} from "solid-js";
import {
  type IFieldContextConfig,
  type FieldContextProviderProps,
  RootFieldName,
  FieldContextConfig,
  type IFormInstance,
} from "./types";
import utils from "./utils";
import { IsNotUndefinedOrNull } from "@src/components/FieldContext";

const DefaultFieldContext: IFieldContextConfig = {
  name: () => RootFieldName,
  path: () => [RootFieldName],
  isArray: () => false,
  value: () => undefined,
  defaultValue: () => undefined,
  setValue: undefined,
  deleteField: () => {},
  deep: undefined,
};

export const FieldContext = createContext(DefaultFieldContext);

export const useFieldContext = () => useContext(FieldContext);

export const FieldContextProvider = <V = any,>(
  props: ParentProps<FieldContextProviderProps<V>>
) => {
  const [local, field] = splitProps(props, ["children"]);

  const parent_field = useFieldContext();

  const parent_value = createMemo(() => parent_field.value());
  const parent_defaultValue = createMemo(() => parent_field.defaultValue());

  const hasFieldName = createMemo(() => utils.IsValidFieldName(field.name));

  const current_name = createMemo(() =>
    utils.IsValidFieldName(field.name) ? field.name : parent_field.name()
  );
  const current_path = createMemo(() =>
    hasFieldName()
      ? [...parent_field.path(), current_name()]
      : parent_field.path()
  );
  const current_defaultValue = createMemo(() =>
    hasFieldName() ? field.defaultValue : parent_defaultValue()
  );
  const current_value = createMemo(() => {
    if (utils.ExistsProps(field, "value")) {
      return props.value;
    } else {
      if (hasFieldName()) {
        return parent_value()?.[current_name()];
      }
      return parent_value();
    }
  });
  const current_is_array = createMemo(() =>
    hasFieldName()
      ? (IsNotUndefinedOrNull(current_value()) &&
          Array.isArray(current_value())) ||
        (field.isArray ?? false)
      : parent_field.isArray()
  );
  const isRoot = createMemo(() => parent_field === undefined);

  // 内部状态
  const [_current_value, _set_current_value] = createSignal(current_value());

  createEffect(
    on(_current_value, (v) => {
      if (v === current_value()) {
        return; // 值未变化时不刷新
      }

      if (hasFieldName()) {
        // 当前有字段值
        field.onValueChanged?.(v); // 当前字段发生改变触发字段，若当前为透传中间节点则不触发

        parent_field.setValue?.((p) => {
          if (utils.IsObjectOrArray(p)) {
            p[current_name()] = v;
            return utils.RebuildObj(p);
          } else if (parent_field.isArray()) {
            const index = parseInt(current_name() as string);
            const array = Array.from({ length: index + 1 });
            array[index] = v;
            return array;
          } else {
            return { [current_name()]: v };
          }
        });
      } else {
        // 透传给父级字段
        parent_field.setValue?.(v);
        // field.onChange?.(v);
      }
    })
  );

  const deleteField = () => {
    if (parent_field.isArray?.()) {
      return;
    }

    if (hasFieldName()) {
      const _p = parent_value();
      delete _p[current_name()];
      if (IsNotUndefinedOrNull(_p) && !Array.isArray(_p)) {
        parent_field.setValue?.({ ..._p });
      }
    } else {
      parent_field?.deleteField?.();
    }
  };

  const current_context = createMemo(() => {
    return new FieldContextConfig(
      current_name,
      current_path,
      current_is_array,
      current_value,
      current_defaultValue,
      _set_current_value,
      deleteField,
      (parent_field.deep ?? 0) + 1
    );
  });

  return (
    <FieldContext.Provider value={current_context()}>
      {local.children}
    </FieldContext.Provider>
  );
};

export const FormContext = createContext<IFormInstance>();

export const useFormContext = () => useContext(FormContext);
