import { RouteConfig } from 'react-router-config';
import { dynamic } from '../../../utils/dynamic';

export const routes: RouteConfig[] = [
  {
    path: '/home',
    component: dynamic(() => import('./index'))
  }
];
