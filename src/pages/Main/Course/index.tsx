import { Avatar } from 'antd';
import { autorun, computed } from 'mobx';
import { inject, observer, Provider } from 'mobx-react';
import { destroy } from 'mobx-state-tree';
import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { IDescriptionItem } from '../../../components/common/Descriptions';
import PageContainer from '../../../components/common/PageHeader/pageContainer';
import withHeaderRoom from '../../../components/header/HeaderRoom/decorator';
import { CourseStore, ICourseStore } from '../../../stores/Course';
import { IGlobalStore } from '../../../stores/Global';

const RoleMap = {
  TA: '助教',
  student: '学生',
  teacher: '教师'
};

interface IOneCourseProps extends RouteConfigComponentProps<{ course_id: string }> {
  $Global?: IGlobalStore;
}

@inject('$Global')
@withHeaderRoom<IOneCourseProps>(() => '课程')
@observer
export default class OneCourse extends React.Component<IOneCourseProps> {

  $Course: ICourseStore = CourseStore.create();

  disposer = autorun(() => {
    const { $Global } = this.props;
    if (this.$Course.detail && this.$Course.detail!.course_name) {
      $Global!.setHeaderText(this.$Course.detail!.course_name);
    }
  });

  @computed
  get title() {
    const { $Global } = this.props;
    return this.$Course.detail && this.$Course.detail!.course_name || '课程';
  }

  @computed
  get meta(): IDescriptionItem[] {
    return this.$Course.detail && [
      {
        term: '教师',
        key: 'teacher',
        icon: 'contacts',
        value: this.$Course.detail!.teacher
      },
      {
        term: '学期',
        key: 'school_year',
        icon: 'calendar',
        value: `${this.$Course.detail!.school_year} ${this.$Course.detail!.term}`
      },
      {
        term: '我的角色',
        key: 'my-role',
        icon: 'user',
        value: RoleMap[ this.$Course.detail!.role ]
      }
    ] || [];
  }

  @computed
  get Avatar() {
    let src: string | undefined;
    if (this.$Course.detail) {
      src = `/api/users/profile/avatar?username=${this.$Course.detail!.creator!.username}`;
    }
    return (
      <Avatar icon={ 'user' } src={ src } />
    );
  }

  async componentDidMount() {
    const { $Global, match } = this.props;
    const courseId = Number.parseInt(match.params.course_id);
    await Promise.all([
      this.$Course.LoadOneCourseAsync(courseId),
      this.$Course.LoadMembersAsync(courseId),
      this.$Course.LoadDiscussionsAsync(courseId)
    ]);

  }

  componentWillUnmount() {
    this.disposer();
    destroy(this.$Course);
  }

  render() {
    const { route } = this.props;
    return (
      <Provider $Course={ this.$Course }>
        <PageContainer
          title={ this.title }
          loading={ this.$Course.$loading.get('LoadOneCourseAsync') }
          dataSource={ this.meta }
          logo={ this.Avatar }
        >
          { renderRoutes(route!.routes) }
        </PageContainer>
      </Provider>
    );
  }
}
