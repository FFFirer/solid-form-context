import { createSignal, type Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import { FieldContextProvider, FieldTest } from './components/FieldContext';

const App: Component = () => {
  const [input, setInput] = createSignal('');
  const [value, setValue] = createSignal(undefined);
  const convert = () => {
    setValue(JSON.parse(input()));
  }
  return (
    <div class={styles.App}>
      <textarea oninput={e => setInput(e.target.value)}></textarea>
      <button type='button' onclick={() => convert()}>convert</button>
      <FieldContextProvider value={value()}>
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
