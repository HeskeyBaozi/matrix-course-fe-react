import { Tabs } from 'antd';
import { action, computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import CodeBlock from '../CodeBlock';

const { TabPane } = Tabs;

export interface ICodeEditorItem {
  name: string;
  code: string;
  readOnly: boolean;
}

interface ICodeEditor {
  dataSource: ICodeEditorItem[];
  extraDataSource?: ICodeEditorItem[];
  extra?: React.ReactNode;
  onChange?: (name: string, code: string) => any;
}

@observer
export default class CodeEditor extends React.Component<ICodeEditor> {

  @computed
  get extraDataSource() {
    return this.props.extraDataSource;
  }

  @action
  onChange = (filename: string, value: string) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(filename, value);
    }
  }

  @computed
  get List() {
    const { dataSource } = this.props;

    return dataSource.map(({ name, code, readOnly }) => (
      <TabPane key={ name } tab={ name }>
        <CodeBlock
          readOnly={ readOnly }
          value={ code }
          filename={ name }
          onChange={ this.onChange }
        />
      </TabPane>
    ));
  }

  @computed
  get ExtraList() {
    const { extraDataSource } = this.props;
    return extraDataSource ? extraDataSource.map(({ name, code }) => (
      <TabPane key={ `extra-${name}` } tab={ `${name} (Read Only)` }>
        <CodeBlock
          readOnly={ true }
          value={ code }
          filename={ name }
        />
      </TabPane>
    )) : null;
  }

  render() {
    return (
      <Tabs type={ 'card' } tabBarExtraContent={ this.props.extra }>
        { this.List }
        { this.ExtraList }
      </Tabs>
    );
  }
}
