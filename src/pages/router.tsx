import React from 'react';
import { RouteConfig } from 'react-router-config';
import { routes as loginRoutes } from './Login/router';
import { routes as mainRoutes } from './Main/router';

export const rootRoutes: RouteConfig[] = [
  ...mainRoutes,
  ...loginRoutes
];
