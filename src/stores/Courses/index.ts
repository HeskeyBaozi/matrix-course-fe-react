import { flow, onSnapshot, types } from 'mobx-state-tree';
import { LoadingStore } from 'src/stores/Loading';
import { UserState } from '../Profile/user';
import { fetchCoursesList } from './services';

const CourseItem = types
  .model({
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
    term: types.string,
    unfinished_num: types.number
  });

type CourseItemType = typeof CourseItem.Type;
export interface ICourseItem extends CourseItemType { }

const CoursesState = types
  .model({
    courses: types.maybe(types.array(CourseItem))
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
  });

type CoursesStoreType = typeof CoursesStore.Type;
export interface ICoursesStore extends CoursesStoreType { }

export const coursesStore: ICoursesStore = CoursesStore.create();

onSnapshot(coursesStore, (snapshot) => {
  console.log('snapshot');
  console.dir(snapshot);
});
