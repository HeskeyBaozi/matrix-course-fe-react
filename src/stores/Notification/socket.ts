import { applyAction, flow, onSnapshot, types } from 'mobx-state-tree';
import { LoadingStore } from '../Loading';
import { MessageState, MessageStateType } from './message';

interface IVolatileSocket {
  socket: WebSocket | null;
}

const NotificaionSocketState = types
  .model({
    latestMessage: types.maybe(MessageState)
  })
  .volatile((): IVolatileSocket => ({
    socket: null
  }));

type NotificaionStateType = typeof NotificaionSocketState.Type;
interface INotificationState extends NotificaionStateType { }

export const NotificationSocketStore = NotificaionSocketState
  .actions((self: INotificationState) => {
    return {
      connectSocketAsync: flow(function* connectSocketAsync() {
        yield new Promise<void>((resolve, reject) => {
          self.socket = new WebSocket(`ws://localhost:3000/api/notifications`);
          self.socket.onmessage = ({ data }) => {
            const json = JSON.parse(data);
            if (json.status === 'NOT_AUTHORIZED') {
              applyAction(self, { name: 'closeSocket' });
            } else {
              applyAction(self, { name: 'handleMessageComes', args: [ json.data as MessageStateType ] });
            }
          };
          self.socket.onopen = (event) => resolve();
          self.socket.onerror = (error) => reject(error);
        });
      }),
      closeSocket() {
        if (self.socket) {
          self.socket.close();
        }
      },
      handleMessageComes(message: MessageStateType) {
        self.latestMessage = message;
      },
      beforeDestroy() {
        this.closeSocket();
      }
    };
  });

type NotificationSocketStoreType = typeof NotificationSocketStore.Type;
export interface INotificationSocketStore extends NotificationSocketStoreType { }

export const notificationSocketStore: INotificationSocketStore = NotificationSocketStore.create();
