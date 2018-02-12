import { Button } from 'antd';
import React from 'react';
import styles from './App.module.css';
import CodeBlock from './components/CodeBlock';
import logo from './logo.svg';

const cppCode = `
#include <iostream>
using namespace std;

int main() {
  int a = 3;
  cout << "Hello, World" << a << endl;
  return 0;
}
`;

class App extends React.Component {

  render() {
    return (
      <div className={ styles.App }>
        <header className={ styles[ 'App-header' ] }>
          <img src={ logo } className={ styles.hello } alt='logo'/>
          <h1 className={ styles.hello }>Welcome to React</h1>
        </header>
        <p className={ styles[ 'App-intro' ] }>
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <div>
          <Button icon={ 'smile-o' } type={ 'primary' }>Hello</Button>
        </div>
        <CodeBlock value={ cppCode } readOnly={ true } filename={ '.cpp' }/>
      </div>
    );
  }
}

export default App;
