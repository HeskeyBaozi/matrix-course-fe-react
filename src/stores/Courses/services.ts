import { IMatrixResponse, xios } from '../axios';
import { ICoursesItem } from './interfaces';

// https://api.vmatrix.org.cn/#/course/get_api_courses
export function fetchCoursesList() {
  return xios.get<IMatrixResponse<ICoursesItem[]>>('/api/courses');
}
