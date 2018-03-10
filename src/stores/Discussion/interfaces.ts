export interface IDiscussionArgs {
  course_id: number;
  discussion_id: number;
}

export interface IVoteBody {
  id: number;
  action: 1 | 0 | -1;
}

export interface ICreateAnswerBody {
  description: string;
  users: number[];
}

export interface ICreateReplyBody extends ICreateAnswerBody {
  id: number;
}
