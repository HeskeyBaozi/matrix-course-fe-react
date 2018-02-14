import React from 'react';
import { RouteConfig } from 'react-router-config';
import { dynamic } from '../../utils/dynamic';

export const routes: RouteConfig[] = [
  {
    path: '/login',
    component: dynamic(() => import('./Form'))
  }
];
