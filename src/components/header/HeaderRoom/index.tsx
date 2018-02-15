import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import HeadRoom from 'react-headroom';
import { IGlobalStore } from '../../../stores/Global';
import styles from './index.module.less';

interface IHeaderRoomProps {
  $Global?: IGlobalStore;
  pageHeader?: string;
}

@inject('$Global')
@observer
export default class HeaderRoom extends React.Component<IHeaderRoomProps> {

  @observable
  isShowPageHeader = false;

  @action
  handleUnpin = () => {
    this.isShowPageHeader = true;
  }

  @action
  handlePin = () => {
    this.isShowPageHeader = false;
  }

  @computed
  get pageHeaderClassNames() {
    const classNames = [ styles.PageHeader ];
    if (this.isShowPageHeader) {
      classNames.push(styles.isShown);
    }
    return classNames.join(' ');
  }

  render() {
    const { $Global, children, pageHeader = $Global!.headerText } = this.props;
    return (
      <div className={ styles.AppHeader }>
        <HeadRoom
          pinStart={ $Global!.pinStart }
          disableInlineStyles={ true }
          onUnpin={ this.handleUnpin }
          onPin={ this.handlePin }
          onUnfix={ this.handlePin }
        >
          { children }
        </HeadRoom>
        <div className={ this.pageHeaderClassNames }>
          <span className={ styles.text }>{ pageHeader }</span>
        </div>
      </div>
    );
  }
}
