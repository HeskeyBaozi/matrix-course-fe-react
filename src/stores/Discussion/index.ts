import { flow, types } from 'mobx-state-tree';
import { ICreateAnswerBody, ICreateReplyBody, IDiscussionArgs, IVoteBody } from '../../stores/Discussion/interfaces';
import { LoadingStore } from '../Loading';
import { fetchDetail, postAnswerVote, postCreateAnswer, postCreateReply, postDiscusstionVote } from './services';
import { AnswerState, CommentState, DiscussionDetail } from './type';

const DiscussionState = types
  .model({
    detail: types.maybe(DiscussionDetail),
    fromCourse: types.maybe(types.model({
      course_id: types.number,
      name: types.string
    }))
  });

type DiscussionStateType = typeof DiscussionState.Type;
export interface IDiscussionState extends DiscussionStateType { }

export const DiscussionStore = types
  .compose(DiscussionState, LoadingStore)
  .actions((self: IDiscussionState) => {
    return {
      LoadDetailAsync: flow(function* LoadDetailAsync(args: IDiscussionArgs) {
        const { data: { data, paramData } } = yield fetchDetail(args);
        self.detail = data;
        self.fromCourse = paramData.course || null;
      }),
      VoteAsync: flow(function* VoteAsync(args: IDiscussionArgs, body: IVoteBody) {
        yield postDiscusstionVote(args, body);
        if (self.detail) {
          self.detail.applyVote(body.action);
        }
      }),
      VoteAnswerAsync: flow(function* VoteAnswerAsync(args: IDiscussionArgs, body: IVoteBody) {
        yield postAnswerVote(args, body);
        if (self.detail) {
          const target = self.detail.answer.find(({ id }) => id === body.id);
          if (target) {
            target.applyVote(body.action);
          }
        }
      }),
      CreateReplyAsync: flow(function* CreateReplyAsync(args: IDiscussionArgs, body: ICreateReplyBody) {
        const { data: { data, time, paramData, status } } = yield postCreateReply(args, body);
        if (self.detail && status === 'OK') {
          const target = self.detail!.answer.find(({ id }) => id === body.id);
          if (target) {
            target.comment.push(CommentState.create({
              date: time,
              description: body.description,
              nickname: '我',
              user_id: paramData && paramData.user && paramData.user.user_id || 0,
              username: paramData && paramData.user && paramData.user.username || ''
            }));
          }
        }
      }),
      CreateAnswerAsync: flow(function* CreateAnswerAsync(args: IDiscussionArgs, body: ICreateAnswerBody) {
        const { data: { data, status, time, paramData, msg } } = yield postCreateAnswer(args, body);
        if (self.detail && status === 'OK') {
          const execResult = msg && /\d+/.exec(msg) || null;
          self.detail!.answer.push(AnswerState.create({
            date: time,
            description: body.description,
            nickname: '我',
            user_id: paramData && paramData.user && paramData.user.user_id || 0,
            username: paramData && paramData.user && paramData.user.username || '',
            comment: [],
            id: execResult && Number.parseInt(execResult[ 0 ]) || 0
          }));
        }
      })
    };
  })
  .named('DiscussionStore');

type DiscussionStoreType = typeof DiscussionStore.Type;
export interface IDiscussionStore extends DiscussionStoreType { }
