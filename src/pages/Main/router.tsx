import React from 'react';
import { Redirect } from 'react-router';
import { RouteConfig } from 'react-router-config';
import { IRouteConfigWithBreadcrumb } from '../../components/common/PageHeader/interfaces';
import LoginAuthorized, { LoginStatus } from '../../components/login/LoginAuthorized';
import { createMenu } from '../../components/menu/GeneralMenu';
import { dynamic } from '../../utils/dynamic';
import { routes as coursesRoutes } from './Courses/router';
import { routes as homeRoutes } from './Home/router';

const MainComponent = dynamic(() => import('./index'));

export const routes: IRouteConfigWithBreadcrumb[] = [
  {
    path: '/',
    breadcrumbName: '首页',
    icon: 'home',
    component: (props) => (
      <LoginAuthorized
        authority={ [ LoginStatus.User ] }
        redirectPath={ '/login' }
      >
        <MainComponent { ...props } />
      </LoginAuthorized>
    ),
    routes: [
      ...homeRoutes,
      ...coursesRoutes,
      {
        path: '*',
        component: () => <Redirect to={ { pathname: '/home' } } />
      }
    ]
  }
];

export const menuRoutes: RouteConfig[] = [
  {
    path: '/',
    component: createMenu<{}>({
      dataSource: [
        { url: '/home', icon: 'home', title: '概览' },
        { url: '/courses', icon: 'book', title: '课程' },
        { url: '/notification', icon: 'bell', title: '消息' },
        { url: '/setting', icon: 'setting', title: '设置' },
        { url: '/feedback', icon: 'smile-o', title: '反馈' }
      ]
    })
  }
];
