import { types } from 'mobx-state-tree';

const BaseTodoItem = types
  .model({
    ca_id: types.identifier(types.number),
    courseName: types.string,
    course_id: types.number,
    enddate: types.Date,
    grade_at_end: types.number,
    ptype_id: types.number,
    title: types.string,
    type: types.string
  });

export const StudentTodoItem = types
  .compose(
    BaseTodoItem,
    types.model({
      remainingTime: types.number
    })
  );

type StudentTodoItemType = typeof StudentTodoItem.Type;
export interface IStudentTodoItem extends StudentTodoItemType { }

export const TeacherOrTaTodoItem = types
  .compose(
    BaseTodoItem,
    types.model({
      stuNumWaitingForJudging: types.number,
      submittedStuNum: types.number
    })
  );

type TeacherOrTaTodoItemType = typeof TeacherOrTaTodoItem.Type;
export interface ITeacherOrTaTodoItem extends TeacherOrTaTodoItemType { }
