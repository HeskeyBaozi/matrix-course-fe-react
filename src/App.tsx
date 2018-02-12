import { Button } from 'antd';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import styles from './App.module.css';
import CodeEditor from './components/CodeEditor';
import Markdown from './components/Markdown';
import MarkdownEditor from './components/MarkdownEditor';
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

@observer
class App extends React.Component {

  @observable
  dataSource = [ { name: 'Hello.cpp', code: cppCode, readOnly: false } ];

  @action
  handleChange = (filename: string, code: string) => {
    console.log('name', name, 'code', code);
    const target = this.dataSource.find(({ name }) => name === filename);
    if (target) {
      target.code = code;
    }
  }

  @action
  handleClick = (e: any) => {
    console.log('current', this.dataSource.slice());
    this.dataSource = [
      { name: 'daddy.js', code: `console.log('fuck you');`, readOnly: false }
    ];
  }

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
          <Button
            icon={ 'smile-o' }
            type={ 'primary' }
            onClick={ this.handleClick }
          >Hello
          </Button>
        </div>
        <MarkdownEditor value={ '## Hello, World' }/>
      </div>
    );
  }
}

export default App;
