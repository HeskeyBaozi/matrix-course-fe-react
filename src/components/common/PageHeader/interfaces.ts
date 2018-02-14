import { RouteConfig } from 'react-router-config';

export interface IRouteConfigWithBreadcrumb extends RouteConfig {
  breadcrumbName?: string;
  icon?: string;
  routes?: IRouteConfigWithBreadcrumb[];
}
