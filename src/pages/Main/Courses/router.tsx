import React from 'react';
import { Redirect } from 'react-router';
import { RouteConfig } from 'react-router-config';
import { IRouteConfigWithBreadcrumb } from '../../../components/common/PageHeader/interfaces';
import { dynamic } from '../../../utils/dynamic';

export const routes: IRouteConfigWithBreadcrumb[] = [
  {
    path: '/courses',
    exact: true,
    component: () => <Redirect to={ { pathname: '/courses/open' } } />
  },
  {
    path: '/courses/:status',
    component: dynamic(() => import('./List'))
  }
];
