import React from 'react';
import { RouteConfig } from 'react-router-config';
import { IRouteConfigWithBreadcrumb } from '../components/common/PageHeader/interfaces';
import LoginAuthorized, { LoginStatus } from '../components/login/LoginAuthorized';
import { dynamic } from '../utils/dynamic';
import { routes as loginRoutes } from './Login/router';
import { routes as mainRoutes } from './Main/router';

const LoginComponent = dynamic(() => import('./Login'));
const MainComponent = dynamic(() => import('./Main'));

export const rootRoutes: IRouteConfigWithBreadcrumb[] = [
  {
    path: '/login',
    component: (props) => (
      <LoginAuthorized
        authority={ [ LoginStatus.Guest ] }
        redirectPath={ '/' }
      >
        <LoginComponent { ...props } />
      </LoginAuthorized>
    ),
    routes: loginRoutes
  },
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
    routes: mainRoutes
  }
];
