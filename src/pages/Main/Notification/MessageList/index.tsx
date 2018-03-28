import { Avatar, Badge, Button, Card, Divider, Icon, Input, List, Radio, Select, Tooltip } from 'antd';
import { RadioChangeEvent } from 'antd/es/radio';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../../../components/common/Loading';
import withHeaderRoom from '../../../../components/header/HeaderRoom/decorator';
import { IGlobalStore } from '../../../../stores/Global';
import { INotificationStore } from '../../../../stores/Notification';
import { IDiscussionState, MessageStateType } from '../../../../stores/Notification/message';
import { MessageStatusFilter, MessageTypeFilter } from './enum';
import MessageCard from './MessageCard';

interface INotificationListProps {
  $Global?: IGlobalStore;
  $Notification?: INotificationStore;
}

@inject('$Global', '$Notification')
@withHeaderRoom<INotificationListProps>((props) => '所有消息')
@observer
export default class NotificationList extends React.Component<INotificationListProps> {

  @observable
  page = {
    current: 1,
    pageSize: 20
  };

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

  handleClickOneKeyRead = (e: SyntheticEvent<HTMLButtonElement>) => {
    if (this.UnreadDataSource) {
      const { $Notification } = this.props;
      $Notification!.SetNotificationsStatusAsync({
        id: [ ...this.UnreadDataSource.map(({ id }) => id) ],
        status: true
      });
    }
  }

  async componentDidMount() {
    const { $Notification } = this.props;
    if (!$Notification!.list || $Notification!.list!.length !== this.pagination.pageSize) {
      await $Notification!.LoadNotificationsAsync(this.pagination);
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
    return this.baseDataSource &&
      this.baseDataSource.filter(({ displayName, type, displayText, status }) => {
        let result: boolean = true;
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
            (typeof displayName === 'string' && displayName.includes(this.filter.search)) ||
            (typeof displayText === 'string' && displayText.includes(this.filter.search))
          );
        }
        return result;
      });
  }

  @computed
  get UnreadDataSource() {
    return this.baseDataSource &&
      this.baseDataSource.filter(({ status }) => status === 0);
  }

  renderItem = (item: MessageStateType) => {
    return (
      <List.Item>
        <MessageCard item={ item } />
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
  handleStatusChange = (e: RadioChangeEvent) => {
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

    const selectOptions = [
      { label: '全部消息类型', value: MessageTypeFilter.All },
      { label: '作业', value: MessageTypeFilter.Homework },
      { label: '课程', value: MessageTypeFilter.Course },
      { label: '讨论', value: MessageTypeFilter.Discussion },
      { label: '题库', value: MessageTypeFilter.Library },
      { label: '系统', value: MessageTypeFilter.System }
    ];

    const { $Notification } = this.props;

    return (
      <Card
        style={ { marginBottom: '1.5rem', textAlign: 'center' } }
        key={ 'filter' }
      >
        <span style={ { marginRight: '1rem' } }>
          <span style={ { marginRight: '.3rem' } }>在本页进行过滤</span>
          <Tooltip title={ '由于服务端限制, 只能在本页中过滤' }>
            <Icon type={ 'question-circle-o' } />
          </Tooltip>
        </span>
        <Radio.Group
          name={ 'status' }
          value={ this.filter.status }
          onChange={ this.handleStatusChange }
          style={ { marginRight: '1rem' } }
        >
          <Radio.Button
            key={ MessageStatusFilter.All }
            value={ MessageStatusFilter.All }
          >
            <span style={ { marginRight: '.5rem' } }>{ '全部' }</span>
            <Badge
              status={ 'default' }
              text={ '' + $Notification!.total }
            />
          </Radio.Button>
          <Radio.Button
            key={ MessageStatusFilter.Unread }
            value={ MessageStatusFilter.Unread }
          >
            <span style={ { marginRight: '.5rem' } }>{ '未读' }</span>
            <Badge status={ $Notification!.unread ? 'error' : 'success' } text={ '' + $Notification!.unread } />
          </Radio.Button>
          <Radio.Button key={ MessageStatusFilter.Read } value={ MessageStatusFilter.Read }>{ '已读' }</Radio.Button>
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
        <Divider dashed={ true } />
        <Badge count={ this.UnreadDataSource && this.UnreadDataSource.length || 0 }>
          <Button
            icon={ 'check' }
            disabled={ !this.UnreadDataSource || this.UnreadDataSource && this.UnreadDataSource.length === 0 }
            loading={ $Notification!.$loading.get('SetNotificationsStatusAsync') }
            onClick={ this.handleClickOneKeyRead }
          >一键标记本页消息为已读
          </Button>
        </Badge>
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
