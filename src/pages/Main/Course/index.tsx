import { autorun, computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import PageContainer from '../../../components/common/PageHeader/pageContainer';
import withHeaderRoom from '../../../components/header/HeaderRoom/decorator';
import { ICourseStore } from '../../../stores/Course';
import { IGlobalStore } from '../../../stores/Global';

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

  disposer = autorun(() => {
    const { $Course, $Global } = this.props;
    if ($Course!.detail && $Course!.detail!.course_name) {
      $Global!.setHeaderText($Course!.detail!.course_name);
    }
  });

  async componentDidMount() {
    const { $Course, $Global, match } = this.props;
    await $Course!.LoadOneCourseAsync(Number.parseInt(match.params.course_id));

  }

  componentWillUnmount() {
    this.disposer();
  }

  render() {
    const { route, $Course } = this.props;
    return (
      <PageContainer title={ this.title } loading={ $Course!.$loading.get('LoadOneCourseAsync') }>
        { renderRoutes(route!.routes) }
      </PageContainer>
    );
  }
}
