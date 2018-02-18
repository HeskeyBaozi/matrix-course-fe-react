import { types } from 'mobx-state-tree';
import { rootRoutes } from '../../pages/router';

const GlobalState = types
  .model('Global', {
    collapsed: true,
    headerText: 'Hello, Matrix!!!',
    pageHeaderHeight: Infinity
  })
  .volatile((self) => {
    return {
      globalRoutes: rootRoutes
    };
  })
  .views((self) => {
    return {
      get pinStart() {
        return Math.max(self.pageHeaderHeight - 64, 64);
      }
    };
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
      },
      resetHeaderText() {
        self.headerText = '';
      },
      setPageHeaderHeight(value: number) {
        self.pageHeaderHeight = value;
      },
      resetPageHeaderHeight() {
        self.pageHeaderHeight = Infinity;
      }
    };
  });

type IGlobalStoreType = typeof GlobalStore.Type;

export interface IGlobalStore extends IGlobalStoreType {
}

export const globalStore: IGlobalStore = GlobalStore.create();
