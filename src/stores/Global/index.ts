import { types } from 'mobx-state-tree';

const GlobalState = types
  .model('Global', {
    collapsed: true,
    headerText: 'Hello, Matrix!!!'
  });

type IGlobalStateType = typeof GlobalState.Type;

interface IGlobalState extends IGlobalStateType {
}

const GlobalStore = GlobalState
  .actions((self: IGlobalState) => {
    return {
      toggle() {
        self.collapsed = !self.collapsed;
      },
      setHeaderText(value: string) {
        self.headerText = value;
      }
    };
  });

type IGlobalStoreType = typeof GlobalStore.Type;

export interface IGlobalStore extends IGlobalStoreType {
}

export const globalStore: IGlobalStore = GlobalStore.create();
