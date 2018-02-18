import { notification } from 'antd';
import { action, computed, observable } from 'mobx';
import { observer, Provider } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import React from 'react';
import { Router } from 'react-router';
import { renderRoutes } from 'react-router-config';
import Loading from '../components/common/Loading';
import { stores } from '../stores';
import { ILoginQueryResult, ILoginSuccessData } from '../stores/Login/interfaces';
import { history } from '../utils/history';
import { rootRoutes } from './router';

@observer
export default class App extends React.Component {

  @observable
  shouldRenderRoutes = true;

  @action
  setShouldRender = (value: boolean) => {
    this.shouldRenderRoutes = value;
  }

  async componentDidMount() {
    const { $Login } = stores;
    const result = (await $Login.QueryLoginStatusAsync()) as ILoginQueryResult;
    if (result && result.status === 'OK') {
      const realname = result.data && (result.data as ILoginSuccessData).realname;
      notification.success({
        description: realname && `欢迎你, ${realname}` || `欢迎你`,
        duration: 1,
        message: '欢迎回来'
      });
    }
    // this.setShouldRender(true);
  }

  @computed
  get Routes() {
    return this.shouldRenderRoutes ? (
      <Router history={ history }>
        { renderRoutes(rootRoutes) }
      </Router>
    ) : null;
  }

  render() {
    const { $Login } = stores;
    return (
      <Provider { ...stores }>
        <div id={ 'app' }>
          {/*<DevTools/>*/ }
          <Loading loading={ $Login.$loading.get('QueryLoginStatusAsync') } fullScreen={ true } tip={ 'Loading...' } />
          { this.Routes }
        </div>
      </Provider>
    );
  }
}
