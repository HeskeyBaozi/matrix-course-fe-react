import { types } from 'mobx-state-tree';

export const UserState = types
  .model({
    email: types.maybe(types.string),
    homepage: types.maybe(types.string),
    phone: types.maybe(types.string),
    realname: types.string,
    username: types.string
  });

type UserStateType = typeof UserState.Type;
export interface IUserState extends UserStateType { }
