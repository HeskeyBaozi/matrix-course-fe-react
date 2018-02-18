import { computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import PageContainer from '../../../components/common/PageHeader/pageContainer';
import withHeaderRoom from '../../../components/header/HeaderRoom/decorator';
import { IGlobalStore } from '../../../stores/Global';

interface INotificationProps extends RouteConfigComponentProps<{}> {
  $Global?: IGlobalStore;
}

@inject('$Global')
@withHeaderRoom<INotificationProps>(() => '所有消息')
@observer
export default class Notification extends React.Component<INotificationProps> {

  render() {
    const { route } = this.props;
    return (
      <PageContainer title={ '所有消息' }>
        { renderRoutes(route!.routes) }
      </PageContainer>
    );
  }
}
