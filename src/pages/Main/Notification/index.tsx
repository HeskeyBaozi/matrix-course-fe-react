import { Badge } from 'antd';
import { computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import pathToRegExp from 'path-to-regexp';
import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { INotificationStore } from 'src/stores/Notification';
import IconText from '../../../components/common/IconText';
import PageContainer from '../../../components/common/PageHeader/pageContainer';

interface INotificationProps extends RouteConfigComponentProps<{}> {
  $Notification?: INotificationStore;
}

@inject('$Notification')
@observer
export default class Notification extends React.Component<INotificationProps> {

  @computed
  get tabList() {
    const { $Notification } = this.props;
    return [
      {
        key: 'messages', tab: (
          <Badge dot={ Boolean($Notification!.unread) }>
            <IconText icon={ 'message' } gutter={ .3 } title={ '消息' } />
          </Badge>
        )
      },
      {
        key: 'todos', tab: (
          <IconText icon={ 'pushpin-o' } gutter={ .3 } title={ '待办' } />
        )
      }
    ];
  }

  @computed
  get activeKey() {
    const { location } = this.props;
    const tokens = pathToRegExp('/notification/:type').exec(location.pathname);
    if (tokens) {
      return tokens[ 1 ];
    }
  }

  handleTabChange = (key: string) => {
    const { history } = this.props;
    history.push(`/notification/${key}`);
  }

  render() {
    const { route, location } = this.props;
    return (
      <PageContainer
        title={ '所有通知' }
        tabList={ this.tabList }
        tabActiveKey={ this.activeKey }
        onTabChange={ this.handleTabChange }
      >
        { renderRoutes(route!.routes) }
      </PageContainer>
    );
  }
}
