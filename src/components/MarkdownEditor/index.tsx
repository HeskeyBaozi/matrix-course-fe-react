import { Icon, Input, Tabs } from 'antd';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React, { SyntheticEvent } from 'react';
import Markdown from '../Markdown';

const TabPane = Tabs.TabPane;
const { TextArea } = Input;

interface IMarkdownEditorProps {
  value: string;
  onValueChange?: (next: string) => any;
  onChange?: (e: SyntheticEvent<HTMLTextAreaElement>) => any;
  minRows?: number;
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
      <span><Icon type={ 'eye-o' }/> Preview</span>
    );
  }

  @computed
  get Edit() {
    return (
      <span><Icon type={ 'edit' }/> Edit</span>
    );
  }

  render() {
    const { minRows } = this.props;
    const autoSize = { minRows: minRows || 4 };
    return (
      <Tabs defaultActiveKey={ '1' } size={ 'small' }>
        <TabPane tab={ this.Edit } key={ '1' }>
          <TextArea
            value={ this.props.value }
            onChange={ this.handleChange }
            autosize={ autoSize }
          />
        </TabPane>
        <TabPane tab={ this.Preview } key={ '2' }>
          <Markdown source={ this.props.value }/>
        </TabPane>
      </Tabs>
    );
  }
}
