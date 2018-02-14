import React from 'react';
import { RouteConfig } from 'react-router-config';
import LoginAuthorized, { LoginStatus } from '../../components/login/LoginAuthorized';
import { dynamic } from '../../utils/dynamic';

const LoginComponent = dynamic(() => import('./index'));

export const routes: RouteConfig[] = [
  {
    path: '/login',
    component: (props) => (
      <LoginAuthorized
        authority={ [ LoginStatus.Guest ] }
        redirectPath={ '/' }
      >
        <LoginComponent { ...props }/>
      </LoginAuthorized>
    ),
    routes: [
      {
        path: '/login',
        component: dynamic(() => import('./Form'))
      }
    ]
  }
];
