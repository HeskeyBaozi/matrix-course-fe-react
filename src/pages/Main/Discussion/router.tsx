import React from 'react';
import { Redirect } from 'react-router';
import { RouteConfig, RouteConfigComponentProps } from 'react-router-config';
import { IRouteConfigWithBreadcrumb } from '../../../components/common/PageHeader/interfaces';
import { dynamic } from '../../../utils/dynamic';

export const routes: IRouteConfigWithBreadcrumb[] = [
  {
    path: '/course/:course_id/discussion/:discussion_id',
    component: dynamic(() => import('./detail'))
  }
];
