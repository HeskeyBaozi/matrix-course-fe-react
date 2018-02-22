import { types } from 'mobx-state-tree';

const BaseTodoItem = types
  .model('BaseTodoItem', {
    ca_id: types.identifier(types.number),
    courseName: types.string,
    course_id: types.number,
    enddate: types.string,
    grade_at_end: types.number,
    ptype_id: types.number,
    title: types.string,
    type: types.string
  });

export const StudentTodoItem = types
  .compose(
  BaseTodoItem,
  types.model({ remainingTime: types.number }))
  .named('StudentTodoItem');

type StudentTodoItemType = typeof StudentTodoItem.Type;
export interface IStudentTodoItem extends StudentTodoItemType { }

export const TeacherOrTaTodoItem = types
  .compose(
  BaseTodoItem,
  types.model({
    stuNumWaitingForJudging: types.number,
    submittedStuNum: types.number
  }))
  .named('TeacherOrTaTodoItem');

type TeacherOrTaTodoItemType = typeof TeacherOrTaTodoItem.Type;
export interface ITeacherOrTaTodoItem extends TeacherOrTaTodoItemType { }
