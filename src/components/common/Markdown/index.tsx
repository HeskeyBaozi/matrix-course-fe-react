import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import MathJax from 'react-mathjax';
import RemarkMathPlugin from 'remark-math';
import CodeBlock from '../CodeBlock/index';
import styles from './index.module.less';

interface IMarkdownProps {
  source: string;
}

@observer
export default class Markdown extends React.Component<IMarkdownProps> {

  @computed
  get renderers() {
    return {
      code: renderCode,
      image: renderPicture,
      inlineCode: renderInlineCode,
      inlineMath: renderInlineMath,
      math: renderMath,
      table: renderTable
    };
  }

  @computed
  get markdownPlugins() {
    return { plugins: [ RemarkMathPlugin ] };
  }

  render() {
    const { source } = this.props;
    return (
      <MathJax.Context>
        <ReactMarkdown source={ source } renderers={ this.renderers } { ...this.markdownPlugins } />
      </MathJax.Context>
    );
  }
}

function renderMath({ value }: { value: string }) {
  return (
    <MathJax.Node>
      { value }
    </MathJax.Node>
  );
}

function renderInlineMath({ value }: { value: string }) {
  return (
    <MathJax.Node inline={ true }>
      { value }
    </MathJax.Node>
  );
}

function renderPicture({ src }: { src: string }) {
  return (
    <img src={ src } className={ styles.image }/>
  );
}

function renderCode(props: { value: string, language: string }) {
  return (
    <CodeBlock
      className={ styles.codeBlock }
      value={ props.value }
      markdown={ true }
      readOnly={ true }
      language={ props.language }
    />
  );
}

function renderInlineCode(props: { value: string, language: string }) {
  return (
    <span
      className={ `${styles.codeFamily} ${styles.inlineCode}` }
    >
      { props.value }
    </span>
  );
}

function renderTable(props: any) {
  return (
    <table className={ styles.table }>
      { props.children }
    </table>
  );
}
