import { flow, onSnapshot, types } from 'mobx-state-tree';
import { IDescriptionItem } from '../../components/common/Descriptions';
import { LoadingStore } from '../Loading';
import { fetchProfile } from './services';
import { UserState } from './user';

const OneProfileState = types
.compose(
  types.model({
    nickname: types.string
  }),
  UserState
);

const ProfileState = types
  .model({
    profile: types.maybe(OneProfileState)
  })
  .views((self) => {
    return {
      get avatarUrl() {
        if (self.profile) {
          return `/api/users/profile/avatar?username=${self.profile.username}`;
        }
      },
      get baseInformationList(): IDescriptionItem[] {
        const list = [];
        if (self.profile) {
          list.push(...[
            { key: 'email', term: '邮箱', icon: 'mail', value: self.profile.email },
            { key: 'homepage', term: '主页', icon: 'link', value: self.profile.homepage },
            { key: 'phone', term: '电话', icon: 'phone', value: self.profile.phone }
          ].filter(({ value }) => value));
        }
        return list;
      }
    };
  });

type IProfileStateType = typeof ProfileState.Type;

interface IProfileState extends IProfileStateType {
}

const ProfileStore = types
  .compose(ProfileState, LoadingStore)
  .actions((self: IProfileState) => {
    return {
      LoadProfileAsync: flow(function* LoadProfileAsync() {
        const { data: { data } } = yield fetchProfile();
        self.profile = data;
        return data;
      })
    };
  });

type IProfileStoreType = typeof ProfileStore.Type;

export interface IProfileStore extends IProfileStoreType {
}

export const profileStore: IProfileStore = ProfileStore.create();
