import { Card, Icon, Input, List, Radio } from 'antd';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { SyntheticEvent } from 'react';
import { RouteConfigComponentProps } from 'react-router-config';
import Loading from '../../../../components/common/Loading';
import { ICourseItem, ICoursesStore } from '../../../../stores/Courses';

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
          prefix={ <Icon type={ 'search' } /> }
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

  handleLinkClick = (e: SyntheticEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const { history } = this.props;
    history.push(e.currentTarget.href);
  }

  renderItem = ({ course_id }: ICourseItem) => (
    <List.Item>
      <a href={ `/course/${course_id}` } onClick={ this.handleLinkClick }>
        { course_id }
      </a>
    </List.Item>
  )

  render() {
    return [
      this.Filter,
      this.List
    ];
  }
}
