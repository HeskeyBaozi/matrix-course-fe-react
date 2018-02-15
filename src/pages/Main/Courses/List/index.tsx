import { Card, Icon, Input, List, Radio } from 'antd';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { SyntheticEvent } from 'react';
import { RouteConfigComponentProps } from 'react-router-config';
import { Link } from 'react-router-dom';
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

  @observable
  searchValue = '';

  @action
  handleSearchValueChange = (e: SyntheticEvent<HTMLInputElement>) => {
    this.searchValue = e.currentTarget.value;
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
  get dataSource() {
    if (this.baseDataSource) {
      return this.baseDataSource.filter(({ course_name, teacher }) => {
        return course_name.includes(this.searchValue) || teacher.includes(this.searchValue);
      });
    }
  }

  handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { history } = this.props;
    history.push(`/courses/${e.target.value}`);
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
          pagination={ false }
          grid={ { gutter: 16, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 } }
          dataSource={ this.dataSource }
          renderItem={ this.renderItem }
        />
      </div>
    );
  }

  renderItem = (item: ICourseItem) => (
    <List.Item className={ styles.listItem }>
      <Link to={ `/course/${item.course_id}` }>
        <CourseCard item={ item } />
      </Link>
    </List.Item>
  )

  render() {
    return [
      this.Filter,
      this.List
    ];
  }
}
