import { createMemo, Index, splitProps } from "solid-js";
import { useFieldContext } from "./contexts";
import type {
  FormListControlAddHandler,
  FormListProps,
  FormListControlRemoveHandler,
  FormListControlProps,
  FormListControlClearHandler,
} from "./types";
import {
  IsNotUndefinedOrNull,
  type FieldProps,
} from "@src/components/FieldContext";
import FormField from "./form-field";

const convertToArray = <T extends {}>(obj: T): T[] => {
  if (Array.isArray(obj)) return obj;
  if (IsNotUndefinedOrNull(obj)) return [obj];
  return [];
};

const addAtIndex = (source: any[], value: any, index?: number) => {
  if (source.length === 0) {
    return [value];
  }

  index ??= source.length;

  if (index > source.length - 1) {
    return [...source, value];
  }

  return source.reduce((prev, curr, i) => {
    prev = prev || [];
    if (i === index) {
      prev.push(value);
    }
    prev.push(curr);
    return prev;
  }, []);
};

const removeAtIndex = (source: any[], index: number) => {
  return source.reduce((prev, curr, i) => {
    prev = prev || [];
    if (i !== index) {
      prev.push(curr);
    }
    return prev;
  }, []);
};

export const formListUtils = { addAtIndex, removeAtIndex, convertToArray };

export const FormListControl = (props: FormListControlProps) => {
  const fieldContext = useFieldContext();
  const values = createMemo(() => convertToArray(fieldContext.value()));

  const add: FormListControlAddHandler = (value?: any, index?: number) => {
    fieldContext.setValue?.((curr) => {
      return addAtIndex(convertToArray(curr), value, index);
    });
  };

  const remove: FormListControlRemoveHandler = (index: number) => {
    fieldContext.setValue?.((curr) => {
      return removeAtIndex(convertToArray(curr), index);
    });
  };

  const clear: FormListControlClearHandler = () => fieldContext.setValue?.([]);

  const fieldProps = createMemo(() =>
    values().map((_: any, i: number) => {
      const p: FieldProps = {
        name: i,
      };

      return p;
    })
  );

  return props.children?.(fieldProps, { add, remove, clear });
};

const FormList = (props: FormListProps) => {
  const [local, control] = splitProps(props, ["name"]);
  return (
    <FormField name={local.name} isArray>
      <FormListControl {...control} />
    </FormField>
  );
};

export default FormList;
