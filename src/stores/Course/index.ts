import { flow, types } from 'mobx-state-tree';
import { MemberState } from '../Course/members';
import { fetchCourseDetail, fetchCourseMembers } from '../Course/services';
import { CourseDetail } from '../Course/type';
import { LoadingStore } from '../Loading';

const CourseState = types
  .model({
    detail: types.maybe(CourseDetail),
    members: types.maybe(types.array(MemberState))
  })
  .views((self) => {
    return {
      get teachers() {
        if (self.members) {
          return self.members.filter(({ role }) => role === 'teacher');
        }
      },
      get TAs() {
        if (self.members) {
          return self.members.filter(({ role }) => role === 'TA');
        }
      },
      get students() {
        if (self.members) {
          return self.members.filter(({ role }) => role === 'student');
        }
      }
    };
  });

type CourseStateType = typeof CourseState.Type;
export interface ICourseState extends CourseStateType { }

export const CourseStore = types
  .compose(CourseState, LoadingStore)
  .actions((self: ICourseState) => {
    return {
      LoadOneCourseAsync: flow(function* LoadOneCourseAsync(courseId: number) {
        const { data: { data } } = yield fetchCourseDetail(courseId);
        self.detail = data;
      }),
      LoadMembersAsync: flow(function* LoadMembersAsync(courseId: number) {
        const { data: { data } } = yield fetchCourseMembers(courseId);
        self.members = data;
      })
    };
  })
  .named('Course');

type CourseStoreType = typeof CourseStore.Type;
export interface ICourseStore extends CourseStoreType { }
