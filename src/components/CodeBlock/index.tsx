import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/javascript/javascript';
import { action, computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import './code.less';
import './github.theme.css';
import languages from './language.json';

interface ICodeBlockProps {
  language?: string;
  filename?: string;
  markdown?: boolean;
  value: string;
  readOnly: boolean;
  className?: string;
  onChange?: (key: string, value: string) => void;
}

@observer
export default class CodeBlock extends React.Component<ICodeBlockProps> {

  static getMimeFromExt(language: string = 'txt') {
    const result = (languages as any[]).find((target) => target.ext.some((ext: any) => ext === language));
    return result ? result.mime : 'text/plain';
  }

  static getExt(filename: string) {
    const result = /\.[^.]+$/.exec(filename);
    return result && result[ 0 ].replace('.', '') || 'txt';
  }

  @computed
  get code() {
    return this.props.value || '';
  }

  @action
  onChangeLocal = (_1: any, _2: any, value: string) => {
    const { filename, onChange } = this.props;
    if (onChange && filename) {
      onChange(filename, value);
    }
  }

  @computed
  get CodeOptions() {
    const { readOnly, language, markdown, filename } = this.props;
    return {
      mode: language && CodeBlock.getMimeFromExt(language) ||
      CodeBlock.getMimeFromExt(CodeBlock.getExt(filename || '')),
      theme: 'github',
      tabSize: 2,
      lineNumbers: !markdown,
      readOnly: readOnly ? (markdown ? 'nocursor' : true) : false
    };
  }

  render() {
    return (
      <CodeMirror
        className={ this.props.className }
        value={ this.code }
        options={ this.CodeOptions }
        onChange={ this.onChangeLocal }
      />
    );
  }
}
