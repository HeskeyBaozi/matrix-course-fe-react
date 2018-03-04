import React from 'react';
import { Redirect } from 'react-router';
import { RouteConfig, RouteConfigComponentProps } from 'react-router-config';
import { IRouteConfigWithBreadcrumb } from '../../../components/common/PageHeader/interfaces';
import { dynamic } from '../../../utils/dynamic';

export const routes: IRouteConfigWithBreadcrumb[] = [
  {
    path: '/course/:course_id',
    exact: true,
    component: (props: RouteConfigComponentProps<{ course_id: string }> | {}) => {
      const { match } = props as RouteConfigComponentProps<{ course_id: string }>;
      return <Redirect to={ { pathname: `/course/${match.params.course_id}/home` } } />;
    }
  },
  {
    path: '/course/:course_id/home',
    component: dynamic(() => import('./Home')),
    breadcrumbName: '概览'
  },
  {
    path: '/course/:course_id/assignments',
    component: () => <div>Assignments</div>,
    breadcrumbName: '作业'
  },
  {
    path: '/course/:course_id/discussions',
    component: dynamic(() => import('./Discussions')),
    breadcrumbName: '讨论'
  }
];
