import { Avatar, Badge, Card } from 'antd';
import { format, formatDistance, isSameISOWeek } from 'date-fns/esm';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import { INotificationStore } from 'src/stores/Notification';
import IconText from '../../../../../components/common/IconText';
import Loading from '../../../../../components/common/Loading';
import { MessageStateType } from '../../../../../stores/Notification/message';
import styles from './index.module.less';

interface IMessageCardProps {
  item: MessageStateType;
  onDirty?: () => void;
  $Notification?: INotificationStore;
}

@inject('$Notification')
@observer
export default class MessageCard extends React.Component<IMessageCardProps> {

  @observable
  status = Boolean(this.props.item.status);

  @action
  setStatus(value: boolean) {
    this.status = value;
  }

  handleSetStatusClick = async (e: SyntheticEvent<HTMLDivElement>) => {
    const { item: { id, status }, $Notification, onDirty } = this.props;
    await $Notification!.SetNotificationsStatusAsync({
      id: [ id ], status: !this.status
    });
    if (onDirty) {
      onDirty();
    }
    this.setStatus(!this.status);
  }

  @computed
  get Avatar() {
    const { item: { displayAvatar } } = this.props;
    return (
      <Avatar {...displayAvatar} />
    );
  }

  @computed
  get Title() {
    const { item: { displayName } } = this.props;
    return (
      <div>
        <span style={ { marginRight: '.5rem' } }>{ displayName }</span>
        <Badge
          style={ { float: 'right' } }
          status={ this.status ? 'default' : 'error' }
          text={ this.status ? '已读' : '未读' }
        />
      </div>
    );
  }

  @computed
  get time() {
    const { item: { time } } = this.props;
    return isSameISOWeek(time, Date.now())
      ? `${formatDistance(time, Date.now())} ago`
      : format(time, 'YYYY-MM-DD HH:mm');
  }

  @computed
  get Description() {
    const { item: { displayText } } = this.props;
    return (
      <div>
        <div>{ displayText }</div>
        <div>{ this.time }</div>
      </div>
    );
  }

  @computed
  get loading() {
    const { item: { id }, $Notification } = this.props;
    const args = $Notification!.$args.get('SetNotificationsStatusAsync');
    return Boolean(
      $Notification!.$loading.get('SetNotificationsStatusAsync')
      && args && args[ 0 ] && args[ 0 ].id && args[ 0 ].id[ 0 ] === id
    );
  }

  @computed
  get Actions() {
    const { item: { displayLink }, $Notification } = this.props;
    const actions = [ (
      <div onClick={ this.handleSetStatusClick }>
        <Loading loading={ this.loading } />
        <IconText
          key={ 'mark' }
          gutter={ .5 }
          icon={ this.status ? 'close' : 'check' }
          title={ this.status ? '标记为未读' : '标记为已读' }
        />
      </div>
    ) ];
    if (displayLink) {
      actions.unshift((
        <Link to={ displayLink }>
          <IconText key={ 'detail' } gutter={ .5 } icon={ 'eye' } title={ '详情' } />
        </Link>
      ));
    }
    return actions;
  }

  @computed
  get Content() {
    return (
      <Card actions={ this.Actions } className={ styles.cardActions }>
        <Card.Meta
          avatar={ this.Avatar }
          title={ this.Title }
          description={ this.Description }
        />
      </Card>
    );
  }

  render() {
    return this.Content;
  }
}
