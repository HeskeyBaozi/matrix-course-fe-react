import React from 'react';
import { Redirect } from 'react-router';
import { RouteConfig } from 'react-router-config';
import { IRouteConfigWithBreadcrumb } from '../../../components/common/PageHeader/interfaces';
import { dynamic } from '../../../utils/dynamic';

export const routes: IRouteConfigWithBreadcrumb[] = [
  {
    path: '/notification/messages',
    breadcrumbName: '消息',
    component: dynamic(() => import('./MessageList'))
  },
  {
    path: '/notification/todos',
    breadcrumbName: '待办',
    component: dynamic(() => import('./TodoList'))
  },
  {
    path: '/notification',
    component: () => <Redirect to={ '/notification/messages' } />
  }
];
