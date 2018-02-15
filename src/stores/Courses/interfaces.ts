import { IUser } from '../Profile/interfaces';

// Courses
export interface ICoursesItem {
  course_id: number;
  course_name: string;
  creator: IUser;
  progressing_num: number;
  role: string;
  school_year: string;
  semester: string;
  status: 'open' | 'close';
  student_num: number;
  teacher: string;
  term: string;
  unfinished_num: number;
}
