import { Icon } from 'antd';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

interface IIconTextProps {
  hasContainer?: boolean;
  icon: string;
  title: React.ReactNode;
  gutter?: number;
}

@observer
export default class IconText extends React.Component<IIconTextProps> {

  @computed
  get Content() {
    const { icon, title, gutter } = this.props;
    return [
      <Icon key={ 'icon' } type={ icon }/>,
      <span key={ 'title' } style={ gutter ? { marginLeft: `${gutter}rem` } : void 0 }>{ title }</span>
    ];
  }

  render() {
    const { hasContainer } = this.props;
    return hasContainer ? (
      <span>{ this.Content }</span>
    ) : this.Content;
  }
}
