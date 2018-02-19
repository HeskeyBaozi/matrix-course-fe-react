import { flow, types } from 'mobx-state-tree';
import { LoadingStore } from '../Loading';
import { IMessagesStatusPutBody, IPaginationArgs } from './interfaces';
import { MessageState } from './message';
import { fetchNotifications, putMessagesStatus } from './service';
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
      }),
      SetNotificationsStatusAsync: flow(function* SetNotificationsStatusAsync(body: IMessagesStatusPutBody) {
        const result = yield putMessagesStatus(body);
        let readDelta: number = 0;
        body.id.forEach((id) => {
          const target = self.list && self.list.find(({ id: listId }) => id === listId);
          if (target) {
            target.status = body.status ? 1 : 0;
            readDelta += body.status ? 1 : -1;
          }
        });
        if (self.unread !== null) {
          self.unread -= readDelta;
        }
      })
    };
  });

type NotificationStoreType = typeof NotificationStore.Type;
export interface INotificationStore extends NotificationStoreType { }

export const notificationStore: INotificationStore = NotificationStore.create();
