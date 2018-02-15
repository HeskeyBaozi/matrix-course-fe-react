import { Menu } from 'antd';
import { ClickParam } from 'antd/es/menu';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import pathToRegexp from 'path-to-regexp';
import React from 'react';
import { RouteConfigComponentProps } from 'react-router-config';
import { IGlobalStore } from '../../../stores/Global';
import IconText from '../../common/IconText';
import styles from './index.module.less';

const { Item } = Menu;

export interface IGeneralMenuItem {
  path?: string;
  url: string;
  icon: string;
  title: React.ReactNode;
}

interface IGeneralMenuProps<P> extends RouteConfigComponentProps<P> {
  $Global?: IGlobalStore;
  dataSource: IGeneralMenuItem[];
  returnTo?: (props: RouteConfigComponentProps<P>) => string;
}

@inject('$Global')
@observer
export default class GeneralMenu<P> extends React.Component<IGeneralMenuProps<P>> {

  @computed
  get ReturnTo() {
    const { returnTo } = this.props;
    return returnTo ? (
      <Item className={ styles.returnItem } key={ 'RETURN' }>
        <IconText icon={ 'rollback' } title={ '返回上一级' } />
      </Item>
    ) : null;
  }

  @computed
  get List() {
    const { dataSource } = this.props;
    return dataSource.map(({ url, icon, title }) => (
      <Item key={ url }>
        <IconText icon={ icon } title={ title } />
      </Item>
    ));
  }

  @computed
  get dataSourceWithRegExp() {
    const { dataSource } = this.props;
    return dataSource.map(({ url, path }) => ({ url, reg: pathToRegexp(path || url) }));
  }

  @computed
  get selectedKeys() {
    const { location } = this.props;
    return this.dataSourceWithRegExp
      /**
       * convert url(path) into regexp and test it to get current selected keys...
       */
      .filter(({ reg }) => reg.test(location.pathname))
      .map(({ url }) => url);
  }

  navigate = ({ key: url }: ClickParam) => {
    const { $Global, dataSource, returnTo, ...restProps } = this.props;
    const { history } = restProps;
    if (url === 'RETURN' && returnTo) {
      history.push(returnTo(restProps));
    } else {
      history.push(url);
    }
  }

  render() {
    const { $Global } = this.props;
    return (
      <Menu
        className={ styles.menu }
        theme={ 'dark' }
        inlineCollapsed={ $Global!.collapsed }
        onClick={ this.navigate }
        mode={ 'inline' }
        selectedKeys={ this.selectedKeys }
      >
        { this.ReturnTo }
        { this.List }
      </Menu>
    );
  }
}

interface IGeneralMenuGeneratorProps<P> {
  dataSource: IGeneralMenuItem[];
  returnTo?: <T = P>(props: RouteConfigComponentProps<T>) => string;
}

export function createMenu<P>({
                                dataSource,
                                returnTo
                              }: IGeneralMenuGeneratorProps<P>) {
  return ((props: RouteConfigComponentProps<P>) => (
    <GeneralMenu
      dataSource={ dataSource }
      returnTo={ returnTo }
      { ...props }
    />
  )) as React.SFC<RouteConfigComponentProps<P> | {}>;
}
