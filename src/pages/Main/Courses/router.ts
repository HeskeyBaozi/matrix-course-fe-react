import { RouteConfig } from 'react-router-config';
import { IRouteConfigWithBreadcrumb } from '../../../components/common/PageHeader/interfaces';
import { dynamic } from '../../../utils/dynamic';

export const routes: IRouteConfigWithBreadcrumb[] = [
  {
    path: '/courses',
    component: dynamic(() => import('./index')),
    breadcrumbName: '课程'
  }
];
