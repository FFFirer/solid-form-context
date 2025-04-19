import {
  createMemo,
  createRenderEffect,
  Match,
  mergeProps,
  onCleanup,
  onMount,
  splitProps,
  type ComponentProps,
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

export default FormControl;
