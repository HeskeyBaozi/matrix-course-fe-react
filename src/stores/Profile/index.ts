import { flow, onSnapshot, types } from 'mobx-state-tree';
import { LoadingStore } from '../Loading';
import { fetchProfile } from './services';

const OneProfileState = types.model({
  email: types.maybe(types.string),
  homepage: types.maybe(types.string),
  nickname: types.string,
  phone: types.maybe(types.string),
  realname: types.string,
  username: types.string
});

const ProfileState = types
  .model({
    profile: types.maybe(OneProfileState)
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

onSnapshot(profileStore, (snapshot) => {
  console.log('snapshot');
  console.dir(snapshot);
});
