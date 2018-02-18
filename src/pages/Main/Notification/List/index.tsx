import { Avatar, Badge, Button, Card, List } from 'antd';
import { format, formatDistance } from 'date-fns/esm';
import { action, autorun, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { RouteConfigComponentProps } from 'react-router-config';
import { Link } from 'react-router-dom';
import Loading from '../../../../components/common/Loading';
import { INotificationStore } from '../../../../stores/Notification';
import { IDiscussionState, MessageStateType } from '../../../../stores/Notification/message';

interface INotificationList extends RouteConfigComponentProps<{}> {
  $Notification?: INotificationStore;
}

@inject('$Notification')
@observer
export default class NotificationList extends React.Component<INotificationList> {

  static renderItem({ displayName, displayLink, displayText, displayAvatar, time, status }: MessageStateType) {

    const avatar = (
      <Avatar { ...displayAvatar } />
    );

    const description = (
      <div>
        <div>{ displayText }</div>
        <div>{ `${formatDistance(time, Date.now())} ago / ${format(time, 'YYYY-MM-DD HH:mm')}` }</div>
      </div>
    );

    const actions = [ (
      <Link to={ displayLink || '/courses' }>
        <Button key={ 'detail' } icon={ 'eye' } type={ Boolean(status) ? 'ghost' : 'primary' }>
          查看
        </Button>
      </Link>
    ) ];

    return (
      <List.Item actions={ actions }>
        <List.Item.Meta
          avatar={ avatar }
          title={ displayName }
          description={ description }
        />
        <div>
          <Badge status={ Boolean(status) ? 'default' : 'error' } text={ Boolean(status) ? '已读' : '未读' } />
        </div>
      </List.Item>
    );
  }

  @observable.ref
  page = {
    current: 1,
    pageSize: 20
  };

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

  async componentDidMount() {
    const { $Notification } = this.props;
    if (!$Notification!.list || $Notification!.list!.length !== this.pagination.pageSize) {
      await $Notification!.LoadNotificationsAsync(this.pagination);
    }
    autorun(() => {
      $Notification!.LoadNotificationsAsync(this.pagination);
    });
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

  @computed
  get List() {
    const { $Notification } = this.props;
    return (
      <Card key={ 'list' } style={ { position: 'relative' } }>
        <Loading loading={ !$Notification!.list || $Notification!.$loading.get('LoadNotificationsAsync') } />
        <List
          pagination={ this.pagination }
          dataSource={ this.baseDataSource }
          renderItem={ NotificationList.renderItem }
        />
      </Card>
    );
  }

  render() {
    return [
      this.List
    ];
  }
}
