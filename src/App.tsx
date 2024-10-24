import { createEffect, createSignal, on, type Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import { FieldContextProvider, FieldInput, FieldTest } from './components/FieldContext';

const App: Component = () => {
  const [input, setInput] = createSignal('');
  const [value, setValue] = createSignal(undefined);
  const convert = () => {
    const json = JSON.parse(input());
    console.log('json', json);
    setValue(json);
  }

  createEffect(on(value, (v) => {
    console.log('new value!', v);
  }))

  return (
    <div class={styles.App}>
      <textarea oninput={e => setInput(e.target.value)}></textarea>
      <button type='button' onclick={() => convert()}>convert</button>
      <FieldContextProvider value={value()} onChange={setValue}>
        <FieldTest>
          <FieldContextProvider name={'A'}>
            <FieldTest>
              <FieldContextProvider name={'1'}>
                <FieldTest></FieldTest>
              </FieldContextProvider>
              <FieldContextProvider name={'2'}>
                <FieldTest></FieldTest>
              </FieldContextProvider>
            </FieldTest>
          </FieldContextProvider>
          <FieldContextProvider name={'B'}>
            <FieldTest>
              <FieldContextProvider name={'3'}>
                <FieldTest></FieldTest>
              </FieldContextProvider>
              <FieldContextProvider name={'4'}>
                <FieldTest></FieldTest>
                <FieldInput></FieldInput>
              </FieldContextProvider>
            </FieldTest>
          </FieldContextProvider>
          <FieldContextProvider name={'C'}>
            <FieldTest>
              <FieldContextProvider>
                <FieldTest>
                  <FieldContextProvider>
                    <FieldTest>
                      <FieldContextProvider name={'c1'}>
                        <FieldContextProvider name={0}>
                          <FieldTest></FieldTest>
                        </FieldContextProvider>
                      </FieldContextProvider>
                      <FieldContextProvider name={'c2'}>
                        <FieldInput placeholder='c2...'></FieldInput>
                      </FieldContextProvider>
                    </FieldTest>
                  </FieldContextProvider>
                </FieldTest>
              </FieldContextProvider>
            </FieldTest>
          </FieldContextProvider>
        </FieldTest>
      </FieldContextProvider>
    </div>
  );
};

export default App;
