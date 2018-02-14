import { addMiddleware, types } from 'mobx-state-tree';

const LoadingState = types
  .model({
    $loading: types.optional(types.map(types.boolean), {})
  });

type ILoadingStateType = typeof LoadingState.Type;

interface ILoadingState extends ILoadingStateType {
}

export const LoadingStore = LoadingState
  .actions((self: ILoadingState) => {
    addMiddleware(self, (call, next) => {
      if (/Async$/.test(call.name)) {
        if (call.type === 'flow_spawn') {
          self.$loading.set(call.name, true);
        } else if (call.type === 'flow_return' || call.type === 'flow_throw') {
          self.$loading.delete(call.name);
        }
      }
      return next(call);
    });
    return {};
  });

type ILoadingStoreType = typeof LoadingStore.Type;

export interface ILoadingStore extends ILoadingStoreType {
}
