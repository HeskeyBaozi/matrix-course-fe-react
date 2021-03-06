import { IMatrixResponse, xios } from '../axios';
import { IMessagesStatusPutBody, INotificationsResult, IPaginationArgs } from './interfaces';

// https://api.vmatrix.org.cn/#/notifications/get_api_notifications
export function fetchNotifications(args: IPaginationArgs) {
  return xios.get<IMatrixResponse<INotificationsResult>>(
    `/api/notifications?page_id=${args.current}&page_size=${args.pageSize}`
  );
}

// https://api.vmatrix.org.cn/#/notifications/put_api_notifications_status
export function putMessagesStatus(body: IMessagesStatusPutBody) {
  return xios.put<IMatrixResponse<any>>(
    `/api/notifications/status`, body
  );
}
