import { flow, types } from 'mobx-state-tree';
import { LoadingStore } from '../../stores/Loading';
import { CourseItem } from './item';
import { fetchCoursesList } from './services';

const CoursesState = types
  .model({
    courses: types.maybe(types.array(CourseItem))
  })
  .views((self) => {
    return {
      get openList() {
        if (self.courses) {
          return self.courses.filter(({ status }) => status === 'open');
        }
      },
      get closeList() {
        if (self.courses) {
          return self.courses.filter(({ status }) => status === 'close');
        }
      }
    };
  });

type CoursesStateType = typeof CoursesState.Type;
export interface ICoursesState extends CoursesStateType { }

const CoursesStore = types
  .compose(CoursesState, LoadingStore)
  .actions((self: ICoursesState) => {
    return {
      LoadCoursesAsync: flow(function* LoadCoursesAsync() {
        const { data: { data } } = yield fetchCoursesList();
        self.courses = data;
      })
    };
  })
  .named('Courses');

type CoursesStoreType = typeof CoursesStore.Type;
export interface ICoursesStore extends CoursesStoreType { }

export const coursesStore: ICoursesStore = CoursesStore.create();
