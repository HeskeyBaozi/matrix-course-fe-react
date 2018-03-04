import { flow, types } from 'mobx-state-tree';
import { fetchCourseDetail } from '../../stores/Course/services';
import { CourseDetail } from '../../stores/Course/type';
import { LoadingStore } from '../../stores/Loading';

const CourseState = types
  .model({
    detail: types.maybe(CourseDetail)
  });

type CourseStateType = typeof CourseState.Type;
export interface ICourseState extends CourseStateType { }

const CourseStore = types
  .compose(CourseState, LoadingStore)
  .actions((self: ICourseState) => {
    return {
      LoadOneCourseAsync: flow(function* LoadOneCourseAsync(courseId: number) {
        const { data: { data } } = yield fetchCourseDetail(courseId);
        self.detail = data;
      })
    };
  })
  .named('Course');

type CourseStoreType = typeof CourseStore.Type;
export interface ICourseStore extends CourseStoreType { }

export const courseStore: ICourseStore = CourseStore.create();
