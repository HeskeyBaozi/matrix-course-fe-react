import { Avatar, Badge, Card } from 'antd';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Link } from 'react-router-dom';
import Descriptions, { IDescriptionItem } from '../../../../../components/common/Descriptions';
import TextFields, { ITextFieldItem } from '../../../../../components/common/TextFields';
import { ICourseItem } from '../../../../../stores/Courses/item';
import styles from './index.module.less';

interface ICourseCradProps {
  item: ICourseItem;
}

@observer
export default class CourseCard extends React.Component<ICourseCradProps> {

  static CourseStatusMap = {
    close: '已关闭',
    open: '进行中'
  };

  static RoleMap = {
    TA: '助教',
    student: '学生',
    teacher: '教师'
  };

  @computed
  get Title() {
    const { item } = this.props;
    const { creator, course_name, status } = item;
    return (
      <div className={ styles.titleWrapper }>
        <div className={ styles.left }>
          <Avatar icon={ 'user' } src={ `/api/users/profile/avatar?username=${creator.username}` } />
          <span>{ `${creator.realname} / ${course_name}` }</span>
        </div>
        <div className={ styles.right }>
          <Badge status={ status === 'open' ? 'success' : 'error' } text={ CourseCard.CourseStatusMap[ status ] } />
        </div>
      </div>
    );
  }

  @computed
  get descriptions(): IDescriptionItem[] {
    const { item } = this.props;
    const { teacher, school_year, term } = item;
    return [
      { key: 'teacher', icon: 'contacts', term: '教师', value: teacher },
      { key: 'school_term', icon: 'calendar', term: '学期', value: `${school_year} ${term}` }
    ];
  }

  @computed
  get textFields(): ITextFieldItem[] {
    const { item } = this.props;
    const { student_num, progressing_num, role } = item;
    return [
      { title: '学生人数', value: `${student_num}人` },
      { title: '进行中作业', value: `${progressing_num}个` },
      { title: '我的角色', value: CourseCard.RoleMap[ role ] }
    ];
  }

  render() {
    const { item } = this.props;
    const { course_id } = item;
    return (
      <Link to={ `/course/${course_id}` }>
        <Card
          hoverable={ true }
          title={ this.Title }
          className={ styles.cardBody }
        >
          <Descriptions
            style={ { marginBottom: '1.5rem' } }
            layout={ 'vertical' }
            col={ 2 }
            dataSource={ this.descriptions }
          />
          <TextFields dataSource={ this.textFields } />
        </Card>
      </Link>
    );
  }
}
