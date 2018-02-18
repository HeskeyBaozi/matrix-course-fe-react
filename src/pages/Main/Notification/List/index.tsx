import { Avatar, Badge, Button, Card, List } from 'antd';
import { action, autorun, computed, IReactionDisposer, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { RouteConfigComponentProps } from 'react-router-config';
import { Link } from 'react-router-dom';
import Loading from '../../../../components/common/Loading';
import { INotificationStore } from '../../../../stores/Notification';
import { IDiscussionState, MessageStateType } from '../../../../stores/Notification/message';
import MessageCard from './MessageCard';

interface INotificationList extends RouteConfigComponentProps<{}> {
  $Notification?: INotificationStore;
}

@inject('$Notification')
@observer
export default class NotificationList extends React.Component<INotificationList> {

  disposer: IReactionDisposer;

  @observable.ref
  page = {
    current: 1,
    pageSize: 20
  };

  @observable
  isDirty = false;

  @action
  handlePaginationChange = async (next: number, nextSize: number) => {
    this.page = {
      current: next,
      pageSize: nextSize
    };
    console.log(nextSize, this.pagination);
  }

  @action
  handlePageSizeChange = async (next: number, nextSize: number) => {
    this.page = {
      current: 1,
      pageSize: nextSize
    };
  }

  @action
  handleInnerCardChange = () => {
    this.isDirty = true;
  }

  async componentDidMount() {
    const { $Notification } = this.props;
    if (!$Notification!.list || $Notification!.list!.length !== this.pagination.pageSize) {
      await $Notification!.LoadNotificationsAsync(this.pagination);
    }
    this.disposer = autorun(async (r) => {
      console.log('autorun reload');
      r.trace();

      $Notification!.LoadNotificationsAsync(this.pagination);
    });
  }

  componentWillUnmount() {
    const { $Notification } = this.props;
    if (this.isDirty) {
      $Notification!.LoadNotificationsAsync(this.pagination);
    }
    if (this.disposer) {
      this.disposer();
    }
  }

  @computed
  get pagination() {
    const { $Notification } = this.props;
    return {
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: [ '20', '40', '80', '160' ],
      current: this.page.current,
      pageSize: this.page.pageSize,
      size: 'small',
      total: $Notification!.total || 0,
      onChange: this.handlePaginationChange,
      onShowSizeChange: this.handlePageSizeChange
    };
  }

  @computed
  get baseDataSource() {
    const { $Notification } = this.props;
    return $Notification!.list || [];
  }

  renderItem = (item: MessageStateType) => {
    return (
      <List.Item>
        <MessageCard item={ item } onDirty={ this.handleInnerCardChange } />
      </List.Item>
    );
  }

  @computed
  get List() {
    const { $Notification } = this.props;
    return (
      <div key={ 'list' } style={ { position: 'relative' } }>
        <Loading loading={ !$Notification!.list || $Notification!.$loading.get('LoadNotificationsAsync') } />
        <List
          pagination={ this.pagination }
          grid={ { gutter: 16, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 } }
          dataSource={ this.baseDataSource }
          renderItem={ this.renderItem }
        />
      </div>
    );
  }

  render() {
    return [
      this.List
    ];
  }
}
