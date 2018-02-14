import React from 'react';
import { RouteConfig } from 'react-router-config';
import LoginAuthorized, { LoginStatus } from '../../components/login/LoginAuthorized';
import { createMenu } from '../../components/menu/GeneralMenu';
import { dynamic } from '../../utils/dynamic';

const MainComponent = dynamic(() => import('./index'));

export const routes: RouteConfig[] = [
  {
    path: '/',
    exact: true,
    component: (props) => (
      <LoginAuthorized
        authority={ [ LoginStatus.User ] }
        redirectPath={ '/login' }
      >
        <MainComponent { ...props }/>
      </LoginAuthorized>
    )
  }
];

export const menuRoutes: RouteConfig[] = [
  {
    path: '/',
    strict: false,
    component: createMenu<{}>({
      dataSource: [
        { url: '/', icon: 'home', title: '概览' },
        { url: '/courses', icon: 'book', title: '课程' },
        { url: '/notification', icon: 'bell', title: '消息' },
        { url: '/setting', icon: 'setting', title: '设置' },
        { url: '/feedback', icon: 'smile-o', title: '反馈' }
      ]
    })
  }
];
