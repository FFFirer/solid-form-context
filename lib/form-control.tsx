import {
  createMemo,
  createRenderEffect,
  JSX,
  Match,
  mergeProps,
  onCleanup,
  onMount,
  splitProps,
  type ComponentProps,
  type Setter,
  type ValidComponent,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { useFieldContext } from "./contexts";
import {
  type ValueAccessibleComponent,
  type ValueAccessor,
  type FormControlProps,
} from "./types";
import { Log } from "./utils";

const FormControl = <
  V,
  C extends ValueAccessibleComponent<V, ValueAccessor<V>> | ValidComponent,
  P extends ComponentProps<C>,
  K extends keyof P
>(
  p: FormControlProps<V, C, P, K>
) => {
  const stamp = createMemo(() => Date.now());
  const props = mergeProps({ controlValuePropName: "value" }, p);

  const context = useFieldContext();
  const fieldId = createMemo(() => {
    const path = context.path().join(".");
    return path;
  });

  const controlProps = createMemo(() => {
    const valueAccessor: any = {
      [props.controlValuePropName]: context.value(),
    };

    if (props.onControlValueChanged) {
      valueAccessor[props.onControlValueChanged.eventName] =
        props.onControlValueChanged.generateHandler(context.setValue);
    } else {
      valueAccessor["onValueChanged"] = context.setValue;
    }

    return {
      ...props.controlProps,
      ...valueAccessor,
      "attr:data-field-id": fieldId(),
    };
  });

  createRenderEffect(() => {
    context?.setValue?.(
      (prev) =>
        props.controlProps?.[props.controlValuePropName] ?? props.defaultValue
    );
    Log("[CONTROL]", fieldId(), stamp(), "rendered!");
  });

  // onMount(() => {
  //   context?.setValue?.(
  //     (prev) =>
  //       props.controlProps?.[props.controlValuePropName] ?? props.defaultValue
  //   );
  //   Log("[CONTROL]", fieldId(), "rendered!");
  // });

  onCleanup(() => {
    Log("[CONTROL]", fieldId(), stamp(), "cleanup!");
    // context?.setValue?.(null);
    context?.deleteField?.();
  });

  return (
    <>
      {props.control && (
        <Dynamic
          component={props.control}
          {...(controlProps() as any)}
        ></Dynamic>
      )}
    </>
  );
};

export const withFormControl = <
  V,
  C extends ValueAccessibleComponent<V, ValueAccessor<V>> | ValidComponent,
  P extends ComponentProps<C>,
  E extends keyof P
>(
  control: C,
  {
    valuePropName = undefined,
    valueChangedEventName = undefined,
    handler = undefined,
    defaultValue = undefined,
    controlProps = undefined,
  }: {
    valuePropName?: keyof ComponentProps<C>;
    valueChangedEventName?: E;
    handler?: (setter: Setter<V>) => P[E];
    defaultValue?: V;
    controlProps?: Partial<ComponentProps<C>>;
  } = {}
) => {
  const _valuePropName = valuePropName ?? "value";
  const _changedEventName = valueChangedEventName ?? "onChange";

  const _defaultHandler: (
    setter?: Setter<V>
  ) => JSX.ChangeEventHandlerUnion<C, Event> = (setter?) => (e) =>
    setter?.((e.target as any)?.[_valuePropName]);
  const _handler = handler ?? _defaultHandler;

  return (p: P) => (
    <FormControl
      control={control}
      controlProps={{ ...controlProps, ...p }}
      controlValuePropName={_valuePropName}
      onControlValueChanged={{
        eventName: _changedEventName,
        generateHandler: _defaultHandler,
      }}
      defaultValue={defaultValue}
    />
  );
};

export default FormControl;
