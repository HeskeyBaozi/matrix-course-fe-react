import { Card, Col, Divider, Input, Row } from 'antd';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { SyntheticEvent } from 'react';
import { RouteConfigComponentProps } from 'react-router-config';
import Markdown from '../../../../components/common/Markdown';
import { ICourseStore } from '../../../../stores/Course';
import MembersTable, { columns, studentColumns } from './members-table';

interface ICourseHomeProps extends RouteConfigComponentProps<{ course_id: string }> {
  $Course: ICourseStore;
}

@inject('$Course')
@observer
export default class CourseHome extends React.Component<ICourseHomeProps> {

  @observable
  searchStudent = '';

  @action
  handleSearchStudentChange = (e: SyntheticEvent<HTMLInputElement>) => {
    this.searchStudent = e.currentTarget.value;
  }

  @computed
  get studentDataSource() {
    const { $Course } = this.props;
    return $Course!.students && (this.searchStudent ?
      $Course!.students!.filter(({ nickname, realname, student_id }) => {
        return nickname && nickname.includes(this.searchStudent) ||
          realname.includes(this.searchStudent) ||
          student_id && student_id.includes(this.searchStudent);
      }) : $Course!.students
    ) || [];
  }

  @computed
  get BasicInformation() {
    const { $Course } = this.props;
    return (
      <Card
        key={ 'basic-information' }
        loading={ !$Course!.detail || $Course!.$loading.get('LoadOneCourseAsync') }
        title={ '课程信息' }
        style={ { marginBottom: '1rem' } }
      >
        <Markdown source={ $Course!.detail && $Course!.detail!.description || '这个老师很懒，什么都没留下...' } />
      </Card>
    );
  }

  @computed
  get columns() {
    return [

    ];
  }

  @computed
  get titles() {
    return {
      teacher: () => <span style={ { fontSize: '1rem' } }>教师</span>,
      TA: () => <span style={ { fontSize: '1rem' } }>TA</span>,
      student: () => (
        <Row gutter={ 16 }>
          <Col span={ 14 }>
            <span style={ { fontSize: '1rem' } }>学生</span>
          </Col>
          <Col span={ 10 }>
            <Input.Search
              value={ this.searchStudent }
              onChange={ this.handleSearchStudentChange }
              placeholder={ '按昵称、姓名或学号搜索' }
            />
          </Col>
        </Row>
      )
    };
  }

  @computed
  get Members() {
    const { $Course } = this.props;
    return (
      <Card
        key={ 'members' }
        loading={ !$Course!.members || $Course!.$loading.get('LoadMembersAsync') }
        title={ '课程成员' }
        style={ { marginBottom: '1rem' } }
      >
        <MembersTable
          title={ this.titles.teacher }
          size={ 'middle' }
          rowKey={ 'user_id' }
          columns={ columns }
          dataSource={ $Course!.teachers || [] }
        />
        <Divider />
        <MembersTable
          title={ this.titles.TA }
          size={ 'middle' }
          rowKey={ 'user_id' }
          columns={ studentColumns }
          dataSource={ $Course!.TAs || [] }
        />
        <Divider />
        <MembersTable
          title={ this.titles.student }
          size={ 'middle' }
          rowKey={ 'user_id' }
          columns={ studentColumns }
          dataSource={ this.studentDataSource }
        />
      </Card>
    );
  }

  render() {
    return [
      this.BasicInformation,
      this.Members
    ];
  }
}
