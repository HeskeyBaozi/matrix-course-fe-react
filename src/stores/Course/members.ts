import { types } from 'mobx-state-tree';
import { CourseItem } from '../Courses/item';
import { UserState } from '../Profile/user';

export const MemberState = types
  .compose(UserState, types.model({
    nickname: types.maybe(types.string),
    role: types.enumeration('role', [ 'student', 'TA', 'teacher' ]),
    student_id: types.maybe(types.string),
    user_id: types.number
  }))
  .named('MemberState');

type MemberStateType = typeof MemberState.Type;
export interface IMemberState extends MemberStateType { }
