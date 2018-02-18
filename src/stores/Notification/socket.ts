import { applyAction, flow, onSnapshot, types } from 'mobx-state-tree';
import { LoadingStore } from '../Loading';
import { MessageState, MessageStateType } from './message';

const NotificaionSocketState = types
  .model({
    latestMessage: types.maybe(MessageState)
  });

type NotificaionStateType = typeof NotificaionSocketState.Type;
interface INotificationState extends NotificaionStateType { }

export const NotificationSocketStore = NotificaionSocketState
  .actions((self: INotificationState) => {
    let socket: WebSocket;
    return {
      connectSocketAsync: flow(function* connectSocketAsync() {
        yield new Promise<void>((resolve, reject) => {
          socket = new WebSocket(`ws://localhost:3000/api/notifications`);
          socket.onmessage = ({ data }) => {
            const json = JSON.parse(data);
            if (json.status === 'NOT_AUTHORIZED') {
              applyAction(self, { name: 'closeSocket' });
            } else {
              applyAction(self, { name: 'handleMessageComes', args: [ json.data as MessageStateType ] });
            }
          };
          socket.onopen = (event) => resolve();
          socket.onerror = (error) => reject(error);
        });
      }),
      closeSocket() {
        if (socket) {
          socket.close();
        }
      },
      handleMessageComes(message: MessageStateType) {
        self.latestMessage = message;
      }
    };
  });

type NotificationSocketStoreType = typeof NotificationSocketStore.Type;
export interface INotificationSocketStore extends NotificationSocketStoreType { }

export const notificationSocketStore: INotificationSocketStore = NotificationSocketStore.create();
