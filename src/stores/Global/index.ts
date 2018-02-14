import { types } from 'mobx-state-tree';

const GlobalState = types
  .model('Global', {
    collapsed: true
  });

type IGlobalStateType = typeof GlobalState.Type;

interface IGlobalState extends IGlobalStateType {
}

const GlobalStore = GlobalState
  .actions((self: IGlobalState) => {
    return {
      toggle() {
        self.collapsed = !self.collapsed;
      }
    };
  });

type IGlobalStoreType = typeof GlobalStore.Type;

export interface IGlobalStore extends IGlobalStoreType {
}

export const globalStore: IGlobalStore = GlobalStore.create();
