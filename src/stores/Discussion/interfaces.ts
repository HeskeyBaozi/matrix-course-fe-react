export interface IDiscussionArgs {
  course_id: number;
  discussion_id: number;
}

export interface IVoteBody {
  id: number;
  action: 1 | 0 | -1;
}
