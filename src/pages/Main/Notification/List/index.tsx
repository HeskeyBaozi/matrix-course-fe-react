import { Avatar, Badge, Button, Card, Icon, Input, List, Radio, Select } from 'antd';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { SyntheticEvent } from 'react';
import { RouteConfigComponentProps } from 'react-router-config';
import { Link } from 'react-router-dom';
import Loading from '../../../../components/common/Loading';
import { INotificationStore } from '../../../../stores/Notification';
import { IDiscussionState, MessageStateType } from '../../../../stores/Notification/message';
import { MessageStatusFilter, MessageTypeFilter } from './enum';
import MessageCard from './MessageCard';

interface INotificationList extends RouteConfigComponentProps<{}> {
  $Notification?: INotificationStore;
}

@inject('$Notification')
@observer
export default class NotificationList extends React.Component<INotificationList> {

  @observable
  page = {
    current: 1,
    pageSize: 20
  };

  @observable
  isDirty = false;

  @observable
  filter = {
    search: '',
    status: MessageStatusFilter.All,
    type: MessageTypeFilter.All
  };

  @action
  handlePaginationChange = async (next: number, nextSize: number) => {
    this.page = {
      current: next,
      pageSize: nextSize
    };
    const { $Notification } = this.props;
    $Notification!.LoadNotificationsAsync(this.pagination);
  }

  @action
  handlePageSizeChange = async (next: number, nextSize: number) => {
    this.page = {
      current: 1,
      pageSize: nextSize
    };
    const { $Notification } = this.props;
    $Notification!.LoadNotificationsAsync(this.pagination);
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
  }

  componentWillUnmount() {
    if (this.isDirty) {
      const { $Notification } = this.props;
      $Notification!.LoadNotificationsAsync(this.pagination);
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
    return $Notification!.list;
  }

  @computed
  get filteredDataSource() {
    if (this.baseDataSource === null) {
      return null;
    }
    return this.baseDataSource.filter(({ displayName, type, displayText, status }) => {
      let result = true;
      if (this.filter.status !== MessageStatusFilter.All) {
        result = result && (
          (this.filter.status === MessageStatusFilter.Read && status !== 0) ||
          (this.filter.status === MessageStatusFilter.Unread && status === 0)
        );
      }
      if (this.filter.type !== MessageTypeFilter.All) {
        result = result && (
          (this.filter.type === MessageTypeFilter.Course && type === 'course') ||
          (this.filter.type === MessageTypeFilter.Discussion && type === 'discussion') ||
          (this.filter.type === MessageTypeFilter.Homework && type === 'homework') ||
          (this.filter.type === MessageTypeFilter.Library && type === 'library') ||
          (this.filter.type === MessageTypeFilter.System && type === 'system')
        );
      }
      if (this.filter.search !== '') {
        result = result && (
          (Boolean(displayName) && displayName.includes(this.filter.search)) ||
          (Boolean(displayText) && displayText.includes(this.filter.search))
        );
      }
      return result;
    });
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
          dataSource={ this.filteredDataSource || [] }
          renderItem={ this.renderItem }
        />
      </div>
    );
  }

  @action
  handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.filter.status = e.target.value as MessageStatusFilter;
    this.page.current = 1;
  }

  @action
  handleTypeChange = (value: any) => {
    this.filter.type = value as MessageTypeFilter;
    this.page.current = 1;
  }

  @action
  handleSearchValueChange = (e: SyntheticEvent<HTMLInputElement>) => {
    this.filter.search = e.currentTarget.value;
    this.page.current = 1;
  }

  @computed
  get Filter() {

    const options = [
      { label: '全部消息', value: MessageStatusFilter.All },
      { label: '未读', value: MessageStatusFilter.Unread },
      { label: '已读', value: MessageStatusFilter.Read }
    ];

    const selectOptions = [
      { label: '全部消息类型', value: MessageTypeFilter.All },
      { label: '作业', value: MessageTypeFilter.Homework },
      { label: '课程', value: MessageTypeFilter.Course },
      { label: '讨论', value: MessageTypeFilter.Discussion },
      { label: '题库', value: MessageTypeFilter.Library },
      { label: '系统', value: MessageTypeFilter.System }
    ];

    return (
      <Card
        style={ { marginBottom: '1.5rem', textAlign: 'center' } }
        key={ 'filter' }
      >
        <Radio.Group
          name={ 'status' }
          value={ this.filter.status }
          onChange={ this.handleStatusChange }
          style={ { marginRight: '1rem' } }
        >
          { options.map(({ label, value }) => <Radio.Button key={ value } value={ value }>{ label }</Radio.Button>) }
        </Radio.Group>
        <Select
          value={ this.filter.type }
          style={ { marginRight: '1rem' } }
          onSelect={ this.handleTypeChange }
        >
          { selectOptions.map(({ label, value }) => (<Select.Option key={ value }>{ label }</Select.Option>)) }
        </Select>
        <Input
          style={ { maxWidth: '24rem' } }
          value={ this.filter.search }
          placeholder={ '按名称或相关标题搜索' }
          prefix={ <Icon type={ 'search' } style={ { zIndex: -1 } } /> }
          onChange={ this.handleSearchValueChange }
        />
      </Card>
    );
  }

  render() {
    return [
      this.Filter,
      this.List
    ];
  }
}
