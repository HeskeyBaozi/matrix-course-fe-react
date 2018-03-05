import { IMatrixResponse, xios } from '../axios';
import { IDiscussionArgs, IVoteBody } from './interfaces';

export function fetchDetail({ course_id, discussion_id }: IDiscussionArgs) {
  return xios.get<IMatrixResponse<any>>(`/api/courses/${course_id}/discussion/${discussion_id}`);
}

export function postDiscusstionVote({ course_id, discussion_id }: IDiscussionArgs, body: IVoteBody) {
  return xios.post<IMatrixResponse<any>>(`/api/courses/${course_id}/discussion/${discussion_id}/dis_votation`, body);
}

export function postAnswerVote({ course_id, discussion_id }: IDiscussionArgs, body: IVoteBody) {
  return xios.post<IMatrixResponse<any>>(`/api/courses/${course_id}/discussion/${discussion_id}/reply_votation`, body);
}
