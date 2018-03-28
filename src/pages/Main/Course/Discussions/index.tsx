import { Card, Icon, Input, List, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/es/radio';
import { compareAsc } from 'date-fns/esm';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { SyntheticEvent } from 'react';
import { RouteConfigComponentProps } from 'react-router-config';
import Loading from '../../../../components/common/Loading';
import { ICourseStore } from '../../../../stores/Course';
import { IDiscussionItem } from '../../../../stores/Course/Discussions/item';
import DiscussionCard from './discussion-card';
import styles from './index.module.less';

type SorterType = 'latest' | 'hottest' | 'newest';

interface ICourseDiscussionsProps extends RouteConfigComponentProps<{ course_id: string }> {
  $Course?: ICourseStore;
}

@inject('$Course')
@observer
export default class CourseDiscussions extends React.Component<ICourseDiscussionsProps> {

  static renderItem(item: IDiscussionItem) {
    return (
      <List.Item className={ styles.listItem }>
        <DiscussionCard item={ item } />
      </List.Item>
    );
  }

  @observable
  sorter: SorterType = 'latest';

  @observable
  searchValue = '';

  @observable
  currentPage = 1;

  @action
  handleSorterChange = (e: RadioChangeEvent) => {
    this.sorter = e.target.value as SorterType;
    this.currentPage = 1;
  }

  @action
  handleSearchValueChange = (e: SyntheticEvent<HTMLInputElement>) => {
    this.searchValue = e.currentTarget.value;
    this.currentPage = 1;
  }

  @action
  handlePaginationChange = (next: number) => {
    this.currentPage = next;
  }

  @computed
  get pagination() {
    return {
      showQuickJumper: true,
      current: this.currentPage,
      pageSize: 12,
      size: 'small',
      total: this.searchDataSource && this.searchDataSource.length || 0,
      onChange: this.handlePaginationChange
    };
  }

  @computed
  get sortedDataSource() {
    const { $Course } = this.props;
    if ($Course!.discussions) {
      switch (this.sorter) {
        case 'latest':
          return $Course!.discussions!.sort((a, b) => compareAsc(b.lastDate || b.date, a.lastDate || a.date));
        case 'newest':
          return $Course!.discussions!.sort(({ date: a }, { date: b }) => compareAsc(b, a));
        case 'hottest':
          return $Course!.discussions!.sort((a, b) => {
            return ((b.answers || 0) + (b.vote_great || 0) - (b.vote_bad || 0))
              - ((a.answers || 0) + (a.vote_great || 0) - (a.vote_bad || 0));
          });
        default:
          return $Course!.discussions;
      }
    }
  }

  @computed
  get searchDataSource() {
    if (this.sortedDataSource) {
      return this.sortedDataSource
        .filter(({ title }) => title.includes(this.searchValue));
    }
  }

  @computed
  get pagedDataSource() {
    if (this.searchDataSource) {
      const { pageSize, total } = this.pagination;
      const offset = (this.currentPage - 1) * pageSize;
      return this.searchDataSource
        .slice(offset, offset + pageSize >= total ? total : offset + pageSize);
    }
  }

  @computed
  get Filter() {
    return (
      <Card
        key={ 'filter' }
        style={ { marginBottom: '1.5rem', textAlign: 'center' } }
      >
        <Radio.Group
          value={ this.sorter }
          onChange={ this.handleSorterChange }
          style={ { marginRight: '1rem' } }
        >
          <Radio.Button value={ 'latest' }>按最近讨论</Radio.Button>
          <Radio.Button value={ 'hottest' }>按热度</Radio.Button>
          <Radio.Button value={ 'newest' }>按最新发表</Radio.Button>
        </Radio.Group>
        <Input.Search
          style={ { maxWidth: '24rem' } }
          value={ this.searchValue }
          placeholder={ '按标题搜索' }
          prefix={ <Icon type={ 'search' } style={ { zIndex: -1 } } /> }
          onChange={ this.handleSearchValueChange }
        />
      </Card>
    );
  }

  @computed
  get List() {
    const { $Course } = this.props;
    return (
      <div key={ 'list' } style={ { position: 'relative' } }>
        <Loading loading={ !$Course!.discussions || $Course!.$loading.get('LoadDiscussionsAsync') } />
        <List
          pagination={ this.pagination }
          grid={ { lg: 1, gutter: 16 } }
          dataSource={ this.pagedDataSource }
          renderItem={ CourseDiscussions.renderItem }
        />
      </div>
    );
  }

  render() {
    return [
      this.Filter,
      this.List
    ];
  }
}
