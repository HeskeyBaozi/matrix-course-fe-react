import { IMatrixResponse, xios } from '../axios';

// https://api.vmatrix.org.cn/#/course/get_api_courses_assignments
export function fetchStudentTodos() {
  return xios.get<IMatrixResponse<any[]>>(
    `/api/courses/assignments?state=progressing&unsubmitted=1&notFullGrade=1`
  );
}

export function fetchTeacherOrTaTodos() {
  return xios.get<IMatrixResponse<any[]>>(
    `/api/courses/assignments?state=started&waitingForMyJudging=1`
  );
}
