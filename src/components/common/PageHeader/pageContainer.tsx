import { Badge } from 'antd';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { RouteConfig, RouteConfigComponentProps } from 'react-router-config';
import Descriptions, { IDescriptionItem } from '../Descriptions';
import Loading from '../Loading';
import PageHeader from './index';
import styles from './index.module.less';

interface IPageContainerProps {
  loading?: boolean;
  badgeStatus?: 'success' | 'processing' | 'default' | 'error' | 'warning';
  badgeText?: string;
  logo?: React.ReactNode;
  tabList?: Array<{ key: string; tab: React.ReactNode }>;
  onTabChange?: (key: string) => void;
  tabActiveKey?: string;
  col?: number;
  extra?: React.ReactNode;
  globalRoutes?: RouteConfig[];
  dataSource?: IDescriptionItem[];
  title: string;
}

@observer
export default class PageContainer extends React.Component<IPageContainerProps> {

  @computed
  get PageTitle() {
    const { loading, title, badgeStatus, badgeText } = this.props;
    return (
      <div className={ styles.titleWrapper }>
        <Loading loading={ loading } />
        <span>{ title }</span>
        { badgeStatus ? <Badge className={ styles.badgeStatus } status={ badgeStatus } text={ badgeText } /> : null }
      </div>
    );
  }

  @computed
  get DescriptionList() {
    const { dataSource, col } = this.props;
    if (dataSource) {
      return (
        <Descriptions style={ { marginBottom: '1.5rem' } } dataSource={ dataSource } col={ col } />
      );
    }
  }

  render() {
    const { logo, tabList, onTabChange, tabActiveKey, children, globalRoutes, extra } = this.props;
    return (
      <div style={ { margin: '-1.5rem' } }>
        <PageHeader
          style={ { position: 'relative' } }
          logo={ logo }
          title={ this.PageTitle }
          tabList={ tabList }
          tabActiveKey={ tabActiveKey }
          onTabChange={ onTabChange }
          globalRoutes={ globalRoutes }
          extraContent={ extra }
        >
          { this.DescriptionList }
        </PageHeader>
        <div style={ { padding: '1.5rem' } }>
          { children }
        </div>
      </div>
    );
  }
}
