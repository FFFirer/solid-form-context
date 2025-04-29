import {
  createEffect,
  createSignal,
  Index,
  Match,
  on,
  Show,
  Switch,
  type Component,
} from "solid-js";

import styles from "./App.module.css";
import { Border } from "./components/FieldContext";
import Form from "../lib/form";
import {
  FormControl,
  FormField,
  type FormProps,
  type IFormInstance,
} from "../lib";
import Input from "./components/Input";
import { FieldList2 } from "./components/new-field-list";
import { withFormControl } from "@lib/form-control";
import FormList from "@lib/form-list";
import { Log } from "@lib/utils";

const FormInput = withFormControl("input");
const FormCheckbox = withFormControl("input", {
  valuePropName: "checked",
  controlProps: { type: "checkbox" },
});

const App: Component = () => {
  const [form, setForm] = createSignal<IFormInstance | undefined>(undefined);
  const submit = () => form()?.submit();
  const handleSubmit: FormProps["onSubmit"] = (value) => {
    console.log("submited!", value);
  };

  const [state, setState] = createSignal("");

  return (
    <div class={styles.App}>
      <Border>
        <Form
          onRef={setForm}
          onSubmit={handleSubmit}
          onValueChanged={(v) => {
            // console.log("form value changed", v);
          }}
        >
          <FormField name={"A"}>
            <FormField
              name={"1"}
              control={Input}
              controlProps={{ placeholder: "A-1..." }}
            ></FormField>
            <FormField
              name={"2"}
              control={Input}
              controlProps={{ placeholder: "A-2..." }}
            ></FormField>
          </FormField>
          <FormField name={"B"}>
            <FormField name={"level1"}>
              <FormField name={"level2"}>
                <FormField
                  name={"level3"}
                  control={(ctx: any) => (
                    <Border>
                      <Input {...ctx}></Input>
                    </Border>
                  )}
                  controlProps={{ placeholder: "level-3..." }}
                ></FormField>
                <FormField
                  name={"level3-1"}
                  control={"input"}
                  controlProps={{ placeholder: "level3-1..." }}
                  onControlValueChanged={{
                    eventName: "oninput",
                    generateHandler: (setter) => (e) =>
                      setter?.(e.target.value),
                  }}
                ></FormField>
                <FormField name={"level3-2"}>
                  <FormControl
                    control={"input"}
                    onControlValueChanged={{
                      eventName: "oninput",
                      generateHandler: (setter) => (e) =>
                        setter?.(e.target.value),
                    }}
                  ></FormControl>
                </FormField>
                <FormField
                  name={"level3-checked"}
                  control={"input"}
                  controlProps={{ type: "checkbox" }}
                  controlValuePropName={"checked"}
                  onControlValueChanged={{
                    eventName: "onchange",
                    generateHandler: (setter) => (e) =>
                      setter?.(e.target.checked),
                  }}
                >
                  checkbox
                </FormField>
              </FormField>
            </FormField>
          </FormField>
          <FormField name={"C"}>
            <FormField
              name={"c1"}
              control={(ctx: any) => (
                <Border>
                  <Input {...ctx}></Input>
                </Border>
              )}
              controlProps={{ placeholder: "c1..." }}
            ></FormField>
            <FormField name={"items"}>
              <FieldList2></FieldList2>
            </FormField>
          </FormField>
          <Border>
            <FormField name={"nested"}>
              <FormList name="items2">
                {(fields, { add, remove }) => (
                  <>
                    <button type="button" onClick={() => add()}>
                      add
                    </button>
                    <Index each={fields()}>
                      {(field, index) => (
                        <div>
                          <FormField {...field()}>
                            <FormInput placeholder={`index-${index}`} />
                            <button type="button" onClick={() => remove(index)}>
                              remove
                            </button>
                          </FormField>
                        </div>
                      )}
                    </Index>
                  </>
                )}
              </FormList>
            </FormField>
          </Border>
          <Border>
            <FormField name={"Tabs"} onValueChanged={setState} value={state()}>
              <FormControl
                control={"select"}
                controlProps={{
                  children: (
                    <>
                      <option value={"a"}>a</option>
                      <option value={"b"}>b</option>
                      <option value={"c"}>c</option>
                      <option value={"d"}>d</option>
                    </>
                  ),
                }}
                controlValuePropName="value"
                onControlValueChanged={{
                  eventName: "onChange",
                  generateHandler: (setter) => (e) => setter?.(e.target.value),
                }}
              ></FormControl>
            </FormField>

            {/* <Show when={state() === "a"}>
              <FormField name={"a_value"}>
                <FormControl
                  control={"input"}
                  controlProps={{ type: "text", placeholder: "a value" }}
                  onControlValueChanged={{
                    eventName: "onChange",
                    generateHandler: (setter) => (e) =>
                      setter?.(e.target.value),
                  }}
                ></FormControl>
              </FormField>
            </Show> */}
            <Switch>
              <Match when={state() === "a"}>
                <FormField name={"a_value"}>
                  <FormControl
                    control={"input"}
                    controlProps={{ type: "text", placeholder: "a value" }}
                    onControlValueChanged={{
                      eventName: "onChange",
                      generateHandler: (setter) => (e) =>
                        setter?.(e.target.value),
                    }}
                  ></FormControl>
                </FormField>
              </Match>

              <Match when={state() === "b"}>
                <FormField name={"b_value"}>
                  <FormControl
                    control={"input"}
                    controlProps={{ type: "text", placeholder: "b value" }}
                    onControlValueChanged={{
                      eventName: "onChange",
                      generateHandler: (setter) => (e) =>
                        setter?.(e.target.value),
                    }}
                  ></FormControl>
                </FormField>
              </Match>

              <Match when={state() === "c"}>
                <FormField name={"c_value"}>
                  <FormControl
                    control={"input"}
                    controlProps={{ type: "text", placeholder: "c value" }}
                    onControlValueChanged={{
                      eventName: "onChange",
                      generateHandler: (setter) => (e) =>
                        setter?.(e.target.value),
                    }}
                  ></FormControl>
                </FormField>
              </Match>

              <Match when={state() === "d"}>
                <FormField name={"d_value"}>
                  <FormControl
                    control={"input"}
                    controlProps={{ type: "text", placeholder: "d value" }}
                    onControlValueChanged={{
                      eventName: "onChange",
                      generateHandler: (setter) => (e) =>
                        setter?.(e.target.value),
                    }}
                  ></FormControl>
                </FormField>
              </Match>
            </Switch>
          </Border>

          <Border>
            <FormField name={"D"}>
              <FormInput placeholder="field D" />
            </FormField>
          </Border>
        </Form>

        <button type="button" onclick={submit}>
          submit
        </button>
      </Border>

      <Border>
        <h1>TEST-2</h1>
        <Form onValueChanged={(v) => Log("[TEST-2] values changed:", v)}>
          <FormList>
            {(fields, { add, remove, clear }) => (
              <>
                <button type="button" onClick={() => add()}>
                  add
                </button>

                <button type="button" onClick={() => clear()}>
                  clear
                </button>
                <Index each={fields()}>
                  {(field, index) => (
                    <div>
                      <FormField {...field()}>
                        <FormInput placeholder={`index-${index}`} />
                        <button type="button" onClick={() => remove(index)}>
                          remove
                        </button>
                      </FormField>
                    </div>
                  )}
                </Index>
              </>
            )}
          </FormList>
        </Form>
      </Border>
    </div>
  );
};

export default App;
