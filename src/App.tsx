import { createEffect, createSignal, on, type Component } from 'solid-js';

import styles from './App.module.css';
import { Border } from './components/FieldContext';
import Form from '../lib/form';
import { FormField, IFormInstance } from '../lib';
import Input from './components/Input';
import { FieldList2 } from './components/new-field-list';

const App: Component = () => {
  const [value, setValue] = createSignal(undefined);

  createEffect(on(value, (v) => {
    console.log('value changed!', JSON.stringify(v));
  }))

  const [form, setForm] = createSignal<IFormInstance | undefined>(undefined)
  const submit = () => form()?.submit();

  return (
    <div class={styles.App}>
        <Border>
          <Form onRef={setForm} onSubmit={setValue}>
            <FormField name={'A'}>
              <FormField name={'1'} control={Input} controlProps={{ placeholder: 'A-1...' }}></FormField>
              <FormField name={'2'} control={Input} controlProps={{ placeholder: 'A-2...' }}></FormField>
            </FormField>
            <FormField name={'B'}>
              <FormField name={'level1'}>
                <FormField name={'level2'}>
                  <FormField name={'level3'}
                    control={(ctx: any) => <Border><Input {...ctx}></Input></Border>}
                    controlProps={{ placeholder: 'level-3...' }}></FormField>
                </FormField>
              </FormField>
            </FormField>
            <FormField name={'C'}>
              <FormField name={'c1'} control={(ctx: any) => <Border><Input {...ctx}></Input></Border>}
                controlProps={{ placeholder: 'c1...' }}></FormField>
              <FormField name={'items'}>
                <FieldList2></FieldList2>
              </FormField>
            </FormField>
          </Form>

          <button type='button' onclick={submit}>submit</button>
        </Border>
    </div>
  );
};

export default App;
