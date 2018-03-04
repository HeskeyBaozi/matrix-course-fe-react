import { Avatar } from 'antd';
import { autorun, computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { IDescriptionItem } from '../../../components/common/Descriptions';
import PageContainer from '../../../components/common/PageHeader/pageContainer';
import withHeaderRoom from '../../../components/header/HeaderRoom/decorator';
import { ICourseStore } from '../../../stores/Course';
import { IGlobalStore } from '../../../stores/Global';

const RoleMap = {
  TA: '助教',
  student: '学生',
  teacher: '教师'
};

interface IOneCourseProps extends RouteConfigComponentProps<{ course_id: string }> {
  $Global?: IGlobalStore;
  $Course?: ICourseStore;
}

@inject('$Global', '$Course')
@withHeaderRoom<IOneCourseProps>(() => '课程')
@observer
export default class OneCourse extends React.Component<IOneCourseProps> {

  @computed
  get title() {
    const { $Course, $Global } = this.props;
    return $Course!.detail && $Course!.detail!.course_name || '课程';
  }

  @computed
  get meta(): IDescriptionItem[] {
    const { $Course } = this.props;
    return $Course!.detail && [
      {
        term: '教师',
        key: 'teacher',
        icon: 'contacts',
        value: $Course!.detail!.teacher
      },
      {
        term: '学期',
        key: 'school_year',
        icon: 'calendar',
        value: `${$Course!.detail!.school_year} ${$Course!.detail!.term}`
      },
      {
        term: '我的角色',
        key: 'my-role',
        icon: 'user',
        value: RoleMap[ $Course!.detail!.role ]
      }
    ] || [];
  }

  @computed
  get Avatar() {
    const { $Course } = this.props;
    let src: string | undefined;
    if ($Course!.detail) {
      src = `/api/users/profile/avatar?username=${$Course!.detail!.creator!.username}`;
    }
    return (
      <Avatar icon={ 'user' } src={ src } />
    );
  }

  disposer = autorun(() => {
    const { $Course, $Global } = this.props;
    if ($Course!.detail && $Course!.detail!.course_name) {
      $Global!.setHeaderText($Course!.detail!.course_name);
    }
  });

  async componentDidMount() {
    const { $Course, $Global, match } = this.props;
    const courseId = Number.parseInt(match.params.course_id);
    await Promise.all([
      $Course!.LoadOneCourseAsync(courseId),
      $Course!.LoadMembersAsync(courseId)
    ]);

  }

  componentWillUnmount() {
    this.disposer();
  }

  render() {
    const { route, $Course } = this.props;
    return (
      <PageContainer
        title={ this.title }
        loading={ $Course!.$loading.get('LoadOneCourseAsync') }
        dataSource={ this.meta }
        logo={ this.Avatar }
      >
        { renderRoutes(route!.routes) }
      </PageContainer>
    );
  }
}
