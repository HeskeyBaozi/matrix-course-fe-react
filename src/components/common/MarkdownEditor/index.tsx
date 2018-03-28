import { Icon, Input, Mention, Tabs } from 'antd';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { SyntheticEvent } from 'react';
import Markdown from '../Markdown';
import styles from './index.module.less';

const TabPane = Tabs.TabPane;
const { TextArea } = Input;

interface IMarkdownEditorProps {
  value: string | object;
  onValueChange?: (next: string) => any;
  onMentionValueChange?: (next: object) => any;
  onChange?: (e: SyntheticEvent<HTMLTextAreaElement>) => any;
  minRows?: number;
  suggestions?: string[];
  mentionHeight?: string;
}

@observer
export default class MarkdownEditor extends React.Component<IMarkdownEditorProps> {

  handleChange = (e: SyntheticEvent<HTMLTextAreaElement>) => {
    if (this.props.onChange) {
      this.props.onChange(e);
    }
    if (this.props.onValueChange) {
      this.props.onValueChange(e.currentTarget.value);
    }
  }

  @computed
  get Preview() {
    return (
      <span><Icon type={ 'eye-o' } /> Preview</span>
    );
  }

  @computed
  get Edit() {
    return (
      <span><Icon type={ 'edit' } /> Edit</span>
    );
  }

  @computed
  get TextArea() {
    const { minRows } = this.props;
    const autoSize = { minRows: minRows || 4 };
    return (
      <TextArea
        value={ this.props.value }
        onChange={ this.handleChange }
        autosize={ autoSize }
      />
    );
  }

  @computed
  get Mention() {
    return (
      <Mention
        style={ { width: '100%', height: this.props.mentionHeight || 100 } }
        onChange={ this.props.onMentionValueChange }
        multiLines={ true }
        suggestions={ this.props.suggestions!.slice() }
      />
    );
  }

  @computed
  get EditArea() {
    return typeof this.props.value !== 'string' &&
      this.props.suggestions &&
      this.props.mentionHeight &&
      this.props.onMentionValueChange &&
      this.Mention || this.TextArea;
  }

  render() {
    const source = typeof this.props.value === 'string' && this.props.value ||
      typeof this.props.value === 'object' && Mention.toString(this.props.value);
    return (
      <Tabs defaultActiveKey={ '1' } size={ 'small' } className={ styles.mention }>
        <TabPane tab={ this.Edit } key={ '1' }>
          { this.EditArea }
        </TabPane>
        <TabPane tab={ this.Preview } key={ '2' }>
          <Markdown source={ source || '' } />
        </TabPane>
      </Tabs>
    );
  }
}
