import { flow, types } from 'mobx-state-tree';
import { IDiscussionArgs, IVoteBody } from '../../stores/Discussion/interfaces';
import { LoadingStore } from '../Loading';
import { fetchDetail, postAnswerVote, postDiscusstionVote } from './services';
import { DiscussionDetail } from './type';

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
      })
    };
  })
  .named('DiscussionStore');

type DiscussionStoreType = typeof DiscussionStore.Type;
export interface IDiscussionStore extends DiscussionStoreType { }
