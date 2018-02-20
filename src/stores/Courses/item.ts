import { types } from 'mobx-state-tree';
import { UserState } from '../Profile/user';

export const CourseItem = types
  .model('CourseItem', {
    course_id: types.identifier(types.number),
    course_name: types.string,
    creator: UserState,
    progressing_num: types.number,
    role: types.enumeration('role', [ 'student', 'TA', 'teacher' ]),
    school_year: types.string,
    semester: types.string,
    status: types.enumeration('status', [ 'open', 'close' ]),
    student_num: types.number,
    teacher: types.string,
    term: types.string
    // unfinished_num: types.number
  });

type CourseItemType = typeof CourseItem.Type;
export interface ICourseItem extends CourseItemType { }
