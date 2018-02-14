import { Icon, Layout } from 'antd';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import logoUrl from '../../assets/images/logo.svg';
import GlobalFooter from '../../components/common/GlobalFooter';
import Particles from '../../components/common/Particles';
import styles from './index.module.less';

interface ILoginProps extends RouteConfigComponentProps<{}> {

}

@observer
export default class Login extends React.Component<ILoginProps> {

  @computed
  get links() {
    return [
      {
        href: 'https://about.vmatrix.org.cn/',
        key: 'about-us',
        title: '关于我们'
      },
      {
        href: 'https://blog.vmatrix.org.cn/',
        key: 'blog',
        title: '技术博客'
      }
    ];
  }

  @computed
  get Copyright() {
    return (
      <div>Copyright <Icon type={ 'copyright' }/> VMatrix</div>
    );
  }

  render() {
    const { route } = this.props;
    return (
      <Layout className={ styles.container }>
        <Particles/>
        <img className={ styles.logo } src={ logoUrl } alt={ 'logo' }/>
        <div className={ styles.inner }>
          { renderRoutes(route!.routes) }
        </div>
        <div className={ styles.footer }>
          <GlobalFooter links={ this.links } copyright={ this.Copyright }/>
        </div>
      </Layout>
    );
  }
}
