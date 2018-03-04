import { flow, types } from 'mobx-state-tree';
import { LoadingStore } from '../Loading';
import { DiscussionItem } from './Discussions/item';
import { MemberState } from './members';
import { fetchCourseDetail, fetchCourseMembers, fetchDiscussions } from './services';
import { CourseDetail } from './type';

const CourseState = types
  .model({
    detail: types.maybe(CourseDetail),
    members: types.maybe(types.array(MemberState)),
    discussions: types.maybe(types.array(DiscussionItem))
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
      }),
      LoadDiscussionsAsync: flow(function* LoadDiscussionsAsync(courseId: number) {
        const { data: { data } } = yield fetchDiscussions(courseId);
        self.discussions = data;
      })
    };
  })
  .named('Course');

type CourseStoreType = typeof CourseStore.Type;
export interface ICourseStore extends CourseStoreType { }
