import React from 'react';
import { Redirect } from 'react-router';
import { RouteConfig } from 'react-router-config';
import { IRouteConfigWithBreadcrumb } from '../../components/common/PageHeader/interfaces';
import createMenu from '../../components/menu/GeneralMenu';
import { dynamic } from '../../utils/dynamic';
import { routes as coursesRoutes } from './Courses/router';
import { routes as homeRoutes } from './Home/router';
import { routes as notificationRoutes } from './Notification/router';

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
    path: '/course/:course_id',
    component: () => <div>OneCourse</div>,
    breadcrumbName: '课程'
  },
  {
    path: '/notification',
    breadcrumbName: '所有通知',
    component: dynamic(() => import('./Notification')),
    routes: notificationRoutes
  },
  {
    path: '*',
    component: () => <Redirect to={ { pathname: '/home' } } />
  }
];

export const menuRoutes: RouteConfig[] = [
  {
    path: '/course/:course_id',
    component: createMenu<{ course_id: string }>({
      dataSource: ({ course_id }) => ([
        { url: `/course/${course_id}/home`, icon: 'home', title: '概览' },
        { url: `/course/${course_id}/assignments`, icon: 'edit', title: '作业' },
        { url: `/course/${course_id}/discussions`, icon: 'coffee', title: '讨论' }
      ]),
      returnTo: () => '/courses'
    })
  },
  {
    path: '/',
    component: createMenu<{}>({
      dataSource: [
        { url: '/home', icon: 'home', title: '概览' },
        { url: '/courses', path: '/courses/:status', icon: 'book', title: '课程' },
        { url: '/notification', path: '/notification/:type', icon: 'bell', title: '通知' },
        { url: '/setting', icon: 'setting', title: '设置' },
        { url: '/feedback', icon: 'smile-o', title: '反馈' }
      ]
    })
  }
];
