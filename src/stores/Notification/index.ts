import { flow, types } from 'mobx-state-tree';
import { LoadingStore } from '../Loading';
import { IPaginationArgs } from './interfaces';
import { MessageState } from './message';
import { fetchNotifications } from './service';
import { INotificationSocketStore, NotificationSocketStore } from './socket';

const NotificationState = types
  .model({
    list: types.maybe(types.array(MessageState)),
    total: types.maybe(types.number),
    unread: types.maybe(types.number)
  });

type NotificationStateType = typeof NotificationState.Type;

interface INotificationState extends NotificationStateType { }

const NotificationStore = types
  .compose(NotificationState, NotificationSocketStore, LoadingStore)
  .actions((self: INotificationState & INotificationSocketStore) => {
    return {
      LoadNotificationsAsync: flow(function* LoadNotificationsAsync(args: IPaginationArgs) {
        const { data: { data: { notifications, total_num, unread_num } } } = yield fetchNotifications(args);
        self.list = notifications;
        self.total = total_num;
        self.unread = unread_num;
      })
    };
  });

type NotificationStoreType = typeof NotificationStore.Type;
export interface INotificationStore extends NotificationStoreType { }

export const notificationStore: INotificationStore = NotificationStore.create();
