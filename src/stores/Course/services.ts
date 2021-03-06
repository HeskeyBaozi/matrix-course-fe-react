import { IMatrixResponse, xios } from '../axios';

// https://api.vmatrix.org.cn/#/course/get_api_courses__course_id_
export function fetchCourseDetail(courseId: number) {
  return xios.get<IMatrixResponse<any>>(`/api/courses/${courseId}`);
}

export function fetchCourseMembers(courseId: number) {
  return xios.get<IMatrixResponse<any[]>>(`/api/courses/${courseId}/members`);
}

/******************************
 *         Discussions
 ******************************/

// https://api.vmatrix.org.cn/#/course_discussion/get_api_courses__course_id__discussion
export function fetchDiscussions(courseId: number) {
  return xios.get<IMatrixResponse<any[]>>(`/api/courses/${courseId}/discussion`);
}
