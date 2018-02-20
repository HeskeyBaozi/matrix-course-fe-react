import { types } from 'mobx-state-tree';

const BaseItem = types
  .model({
    asgn_id: types.number,
    ca_id: types.identifier(types.number),
    course_id: types.number,
    enddate: types.Date,
    ptype_id: types.number,
    standard_score: types.number,
    startdate: types.Date,
    submit_limitation: types.number,
    submit_times: types.number,
    title: types.string,
    type: types.string
  });

export const StudentItem = types
  .model({
    grade: types.maybe(types.number),
    grade_at_end: types.number,
    last_submission_time: types.maybe(types.Date)
  });

export const TeacherOrTaItem = types
  .model({
    author: types.model({ realname: types.string }),
    lib_id: types.number,
    plcheck: types.number,
    prob_id: types.number,
    pub_answer: types.number,
    submit_student_num: types.number,
    total_student: types.number
  });
