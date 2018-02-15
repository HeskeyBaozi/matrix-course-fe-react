import { Breadcrumb, Tabs } from 'antd';
import { Location } from 'history';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { matchRoutes, RouteConfig } from 'react-router-config';
import { Link } from 'react-router-dom';
import { IGlobalStore } from '../../../stores/Global';
import IconText from '../IconText';
import styles from './index.module.less';
import { IRouteConfigWithBreadcrumb } from './interfaces';

const { TabPane } = Tabs;

interface IPageHeaderProps extends RouteComponentProps<any> {
  $Global?: IGlobalStore;
  globalRoutes?: RouteConfig[];
  logo?: React.ReactNode;
  title?: React.ReactNode;
  action?: React.ReactNode;
  extraContent?: React.ReactNode;
  tabList?: Array<{ key: string; tab: React.ReactNode }>;
  onTabChange?: (key: string) => void;
  tabActiveKey?: string;
  style?: React.CSSProperties;
}

@inject('$Global')
@observer
class PageHeader extends React.Component<IPageHeaderProps> {

  headDiv: HTMLDivElement;

  handleHeadDivRef = (div: HTMLDivElement) => {
    this.headDiv = div;
  }

  handleTabChange = (key: string) => {
    const { onTabChange } = this.props;
    if (onTabChange) {
      onTabChange(key);
    }
  }

  componentDidMount() {
    const { $Global } = this.props;
    if (this.headDiv) {
      $Global!.setPageHeaderHeight(this.headDiv.offsetHeight);
    }
  }

  @computed
  get PageBreadcrumb() {
    const { globalRoutes, location, history } = this.props;
    return globalRoutes && location && history ? (
      <Breadcrumb className={ styles.breadcrumb }>
        { this.BreadcrumbMap }
      </Breadcrumb>
    ) : null;
  }

  @computed
  get BreadcrumbMap() {
    const { globalRoutes, location, history } = this.props;
    return globalRoutes && location && history ? (
      matchRoutes<any>(globalRoutes, location.pathname)
        .filter(({ route }) => (route as IRouteConfigWithBreadcrumb).breadcrumbName)
        .map(({ match, route }, index, arr) => {
          const isLast = index === arr.length - 1;
          const { breadcrumbName, icon } = route as IRouteConfigWithBreadcrumb;
          const content = isLast ? (
            <IconText icon={ icon } title={ breadcrumbName } gutter={ .5 } />
          ) : (
              <Link to={ match.url }>
                <IconText icon={ icon } title={ breadcrumbName } gutter={ .5 } />
              </Link>
            );
          return (
            <Breadcrumb.Item key={ match.url }>
              { content }
            </Breadcrumb.Item>
          );
        })
    ) : [];
  }

  @computed
  get TabList() {
    const { tabList, tabActiveKey } = this.props;
    return tabList && tabList.length ? (
      <Tabs
        className={ styles.tabs }
        onChange={ this.handleTabChange }
        activeKey={ tabActiveKey }
      >
        { this.TabListMap }
      </ Tabs>
    ) : null;
  }

  @computed
  get TabListMap() {
    const { tabList } = this.props;
    return tabList && tabList.length ? tabList.map(({ key, tab }) => {
      return (<TabPane tab={ tab } key={ key } />);
    }) : [];
  }

  render() {
    const { logo, title, action, children, extraContent, style } = this.props;
    return (
      <div className={ styles.pageHeader } style={ style } ref={ this.handleHeadDivRef }>
        { this.PageBreadcrumb }
        <div className={ styles.detail }>
          { logo && <div className={ styles.logo }>{ logo }</div> }
          <div className={ styles.main }>
            <div className={ styles.row }>
              { title && <h1 className={ styles.title }>{ title }</h1> }
              { action && <div className={ styles.action }>{ action }</div> }
            </div>
            <div className={ styles.row }>
              { children && <div className={ styles.content }>{ children }</div> }
              { extraContent && <div className={ styles.extraContent }>{ extraContent }</div> }
            </div>
          </div>
        </div>
        { this.TabList }
      </div>
    );
  }
}

export default withRouter(PageHeader);
