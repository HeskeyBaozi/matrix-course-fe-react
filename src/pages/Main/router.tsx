import React from 'react';
import { RouteConfig } from 'react-router-config';
import LoginAuthorized, { LoginStatus } from '../../components/login/LoginAuthorized';
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
