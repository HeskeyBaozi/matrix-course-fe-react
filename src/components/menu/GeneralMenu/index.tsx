import { Menu } from 'antd';
import { ClickParam } from 'antd/es/menu';
import { computed, extendObservable } from 'mobx';
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

interface ICreateMenu<P> {
  dataSource: IGeneralMenuItem[] | ((props: P) => IGeneralMenuItem[]);
  returnTo?: (props: RouteConfigComponentProps<P>) => string;
}

interface IGeneralMenuProps<P> extends RouteConfigComponentProps<P> {
  $Global?: IGlobalStore;
}

export default function createMenu<P>({ dataSource, returnTo }: ICreateMenu<P>)
  : React.ComponentType<IGeneralMenuProps<P> | {}> {
  return inject('$Global')(observer(
    class InnerMenu extends React.Component<IGeneralMenuProps<P>> {
      dataSourceWithRegExp!: Array<{
        url: string;
        reg: RegExp;
      }>;
      List: React.ReactNode;
      ReturnTo: React.ReactNode | null;
      constructor(props: IGeneralMenuProps<P> | {}) {
        super(props as IGeneralMenuProps<P>);
        extendObservable(this, {
          get ReturnTo() {
            return returnTo ? (
              <Item className={ styles.returnItem } key={ 'RETURN' }>
                <IconText icon={ 'rollback' } title={ '返回上一级' } />
              </Item>
            ) : null;
          },
          get source() {
            const { match } = props as IGeneralMenuProps<P>;
            if (typeof dataSource === 'function') {
              return dataSource(match.params);
            }
            return dataSource;
          },
          get List() {
            return this.source.map(({ url, icon, title }) => (
              <Item key={ url }>
                <IconText icon={ icon } title={ title } />
              </Item>
            ));
          },
          get dataSourceWithRegExp() {
            return this.source.map(({ url, path }) => ({ url, reg: pathToRegexp(path || url) }));
          }
        });
      }

      navigate = ({ key: url }: ClickParam) => {
        const { $Global, ...restProps } = this.props;
        const { history } = restProps;
        if (url === 'RETURN' && returnTo) {
          history.push(returnTo(restProps));
        } else {
          history.push(url);
        }
      }

      render() {
        const { $Global, location } = this.props;
        const selectedKeys = this.dataSourceWithRegExp
          /**
           * convert url(path) into regexp and test it to get current selected keys...
           */
          .filter(({ reg }) => reg.test(location.pathname))
          .map(({ url }) => url);
        return (
          <Menu
            className={ styles.menu }
            theme={ 'dark' }
            inlineCollapsed={ $Global!.collapsed }
            onClick={ this.navigate }
            mode={ 'inline' }
            selectedKeys={ selectedKeys }
          >
            { this.ReturnTo }
            { this.List }
          </Menu>
        );
      }
    }
  ));
}
