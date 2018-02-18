import { addMiddleware, applyAction, types } from 'mobx-state-tree';

const LoadingState = types
  .model('Loading', {
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
          applyAction(self, { name: 'startLoading', args: [ call.name ] });
        } else if (call.type === 'flow_return' || call.type === 'flow_throw') {
          applyAction(self, { name: 'endLoading', args: [ call.name ] });
        }
      }
      return next(call);
    });
    return {
      startLoading(name: string) {
        self.$loading.set(name, true);
      },
      endLoading(name: string) {
        self.$loading.delete(name);
      }
    };
  });

type ILoadingStoreType = typeof LoadingStore.Type;

export interface ILoadingStore extends ILoadingStoreType {
}
