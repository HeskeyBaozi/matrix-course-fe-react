import { IMatrixResponse, xios } from '../axios';

// https://api.vmatrix.org.cn/#/course/get_api_courses__course_id_
export function fetchCourseDetail(courseId: number) {
  return xios.get<IMatrixResponse<any>>(`/api/courses/${courseId}`);
}
