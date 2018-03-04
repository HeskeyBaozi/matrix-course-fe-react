import { types } from 'mobx-state-tree';
import { CourseItem } from '../Courses/item';
import { UserState } from '../Profile/user';

export const CourseDetail = types
  .compose(CourseItem, types.model({
    created_at: types.string,
    description: types.string
  }))
  .named('CourseDetail');

type CourseDetailType = typeof CourseDetail.Type;
export interface ICourseDetail extends CourseDetailType { }
