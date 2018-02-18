import { Card, Icon, Input, List, Radio } from 'antd';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { SyntheticEvent } from 'react';
import { RouteConfigComponentProps } from 'react-router-config';
import Loading from '../../../../components/common/Loading';
import { ICourseItem, ICoursesStore } from '../../../../stores/Courses';
import CourseCard from './CourseCard';
import styles from './index.module.less';

interface ICoursesListParams {
  status: string;
}

interface ICoursesListProps extends RouteConfigComponentProps<ICoursesListParams> {
  $Courses?: ICoursesStore;
}

@inject('$Courses')
@observer
export default class CoursesList extends React.Component<ICoursesListProps> {

  static renderItem(item: ICourseItem) {
    return (
      <List.Item className={ styles.listItem }>
        <CourseCard item={ item } />
      </List.Item>
    );
  }

  @observable
  searchValue = '';

  @observable
  currentPage = 1;

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
  get baseDataSource() {
    const { match, $Courses } = this.props;
    switch (match.params.status) {
      case 'open':
        return $Courses!.openList;
      case 'close':
        return $Courses!.closeList;
    }
  }

  @computed
  get searchDataSource() {
    if (this.baseDataSource) {
      return this.baseDataSource
        .filter(({ course_name, teacher }) => {
          return course_name.includes(this.searchValue) || teacher.includes(this.searchValue);
        });
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

  @action
  handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { history } = this.props;
    history.push(`/courses/${e.target.value}`);
    this.currentPage = 1;
  }

  @computed
  get Filter() {
    const { match } = this.props;

    const options = [
      { label: '进行中', value: 'open' },
      { label: '已结束', value: 'close' }
    ];

    return (
      <Card
        style={ { marginBottom: '1.5rem', textAlign: 'center' } }
        key={ 'filter' }
      >
        <Radio.Group
          name={ 'status' }
          value={ match.params.status }
          onChange={ this.handleStatusChange }
          style={ { marginRight: '1rem' } }
        >
          { options.map(({ label, value }) => <Radio.Button key={ value } value={ value }>{ label }</Radio.Button>) }
        </Radio.Group>
        <Input
          style={ { maxWidth: '24rem' } }
          value={ this.searchValue }
          placeholder={ '按课程名称或教师搜索' }
          prefix={ <Icon type={ 'search' } style={ { zIndex: -1 } } /> }
          onChange={ this.handleSearchValueChange }
        />
      </Card>
    );
  }

  @computed
  get List() {
    const { $Courses } = this.props;
    return (
      <div key={ 'list' } style={ { position: 'relative' } }>
        <Loading loading={ !$Courses!.courses || $Courses!.$loading.get('LoadCoursesAsync') } />
        <List
          pagination={ this.pagination }
          grid={ { gutter: 16, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 } }
          dataSource={ this.pagedDataSource }
          renderItem={ CoursesList.renderItem }
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
