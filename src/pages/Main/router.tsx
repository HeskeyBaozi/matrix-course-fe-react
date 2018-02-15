import React from 'react';
import { Redirect } from 'react-router';
import { RouteConfig } from 'react-router-config';
import { IRouteConfigWithBreadcrumb } from '../../components/common/PageHeader/interfaces';
import { createMenu } from '../../components/menu/GeneralMenu';
import { dynamic } from '../../utils/dynamic';
import { routes as coursesRoutes } from './Courses/router';
import { routes as homeRoutes } from './Home/router';

const MainComponent = dynamic(() => import('./index'));

export const routes: IRouteConfigWithBreadcrumb[] = [
  {
    path: '/home',
    component: dynamic(() => import('./Home')),
    routes: homeRoutes
  },
  {
    path: '/courses',
    component: dynamic(() => import('./Courses')),
    breadcrumbName: '所有课程',
    routes: coursesRoutes
  },
  {
    path: '*',
    component: () => <Redirect to={ { pathname: '/home' } } />
  }
];

export const menuRoutes: RouteConfig[] = [
  {
    path: '/',
    component: createMenu<{}>({
      dataSource: [
        { url: '/home', icon: 'home', title: '概览' },
        { url: '/courses', path: '/courses/:status', icon: 'book', title: '课程' },
        { url: '/notification', icon: 'bell', title: '消息' },
        { url: '/setting', icon: 'setting', title: '设置' },
        { url: '/feedback', icon: 'smile-o', title: '反馈' }
      ]
    })
  }
];
