import React from 'react';
import { RouteConfig, RouteConfigComponentProps } from 'react-router-config';
import LoginAuthorized, { LoginStatus } from '../components/login/LoginAuthorized';

const Login = (props: any) => {
  console.log('Login Props = ', props);
  return <h1>You Need To Login</h1>;
};
const Base = (props: any) => <h1>Main</h1>;

export const rootRoutes: RouteConfig[] = [
  {
    path: '/',
    exact: true,
    component: (props) => (
      <LoginAuthorized
        authority={ [ LoginStatus.User ] }
        redirectPath={ '/login' }
      >
        <Base { ...props }/>
      </LoginAuthorized>
    )
  },
  {
    path: '/login',
    component: (props) => (
      <LoginAuthorized
        authority={ [ LoginStatus.Guest ] }
        redirectPath={ '/' }
      >
        <Login { ...props }/>
      </LoginAuthorized>
    )
  }
];
