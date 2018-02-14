import { observer } from 'mobx-react';
import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import PageContainer from '../../../components/common/PageHeader/pageContainer';
import { routes } from '../router';

interface ICoursesProps extends RouteConfigComponentProps<{}> {

}

@observer
export default class Courses extends React.Component<ICoursesProps> {
  render() {
    const { route } = this.props;
    return (
      <PageContainer title={ '课程' } globalRoutes={ routes }>
        { renderRoutes(route!.routes) }
      </PageContainer>
    );
  }
}
