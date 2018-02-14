import { Avatar, Icon, Layout } from 'antd';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import logoTransUrl from '../../assets/images/logo-trans.png';
import { IGlobalStore } from '../../stores/Global';
import styles from './index.module.less';
import { menuRoutes } from './router';

const { Header, Sider, Content } = Layout;

interface IMainProps extends RouteConfigComponentProps<{}> {
  $Global?: IGlobalStore;
}

@inject('$Global')
@observer
export default class Main extends React.Component<IMainProps> {

  handleToggle = () => {
    this.props.$Global!.toggle();
  }

  @computed
  get Menu() {
    const { $Global } = this.props;
    return (
      <Sider
        breakpoint={ 'md' }
        trigger={ null }
        collapsible={ true }
        collapsed={ $Global!.collapsed }
        className={ styles.sider }
      >
        <div className={ styles.logoWrapper }>
          <img src={ logoTransUrl } alt={ 'logo' }/>
        </div>
        { renderRoutes(menuRoutes) }
      </Sider>
    );
  }

  @computed
  get contentLayoutClassNames() {
    const { $Global } = this.props;
    const classNames = [ styles.contentLayout ];
    if ($Global!.collapsed) {
      classNames.push(styles.contentLayoutCollapsed);
    }
    return classNames.join(' ');
  }

  @computed
  get contentHeaderClassNames() {
    const { $Global } = this.props;
    const classNames = [ styles.contentHeader ];
    if ($Global!.collapsed) {
      classNames.push(styles.contentHeaderCollapsed);
    }
    return classNames.join(' ');
  }

  @computed
  get Header() {
    const { $Global } = this.props;
    return (
      <Header className={ this.contentHeaderClassNames }>
        <Icon
          className={ styles.trigger }
          type={ $Global!.collapsed ? 'menu-unfold' : 'menu-fold' }
          onClick={ this.handleToggle }
        />
        <div className={ styles.innerHeader }>
          <span>Hello, World</span>
        </div>
        <div className={ styles.right }>
          <span className={ styles.action }>
            <Icon type={ 'bell' }/>
          </span>
          <span className={ styles.action }>
            <Avatar size={ 'large' } icon={ 'user' } src={ 'none' }/>
          </span>
        </div>
      </Header>
    );
  }

  render() {
    const { route } = this.props;
    return (
      <Layout>
        { this.Menu }
        <Layout className={ this.contentLayoutClassNames }>
          { this.Header }
          <Content className={ styles.content }>
            { renderRoutes(route!.routes) }
          </Content>
        </Layout>
      </Layout>
    );
  }
}