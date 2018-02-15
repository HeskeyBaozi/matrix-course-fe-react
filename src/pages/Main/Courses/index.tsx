import { inject, observer } from 'mobx-react';
import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import PageContainer from '../../../components/common/PageHeader/pageContainer';
import withHeaderRoom from '../../../components/header/HeaderRoom/decorator';
import { IGlobalStore } from '../../../stores/Global';
import { rootRoutes } from '../../router';

interface ICoursesProps extends RouteConfigComponentProps<{}> {
  $Global?: IGlobalStore;
}

@inject('$Global')
@withHeaderRoom<ICoursesProps>(() => '所有课程')
@observer
export default class Courses extends React.Component<ICoursesProps> {

  render() {
    const { route } = this.props;
    const extra = (
      <div style={ { height: '500px', backgroundColor: 'lightblue' } }>test</div>
    );
    return (
      <PageContainer title={ '所有课程' } globalRoutes={ rootRoutes } extra={ extra }>
        { renderRoutes(route!.routes) }
      </PageContainer>
    );
  }
}
