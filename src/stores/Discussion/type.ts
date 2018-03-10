import { types } from 'mobx-state-tree';
import { CourseItem } from '../Courses/item';
import { UserState } from '../Profile/user';

export const CommentState = types
  .model({
    date: types.string,
    description: types.string,
    nickname: types.string,
    user_id: types.number,
    username: types.string
  })
  .named('CommentState');

type CommentStateType = typeof CommentState.Type;
export interface ICommentState extends CommentStateType { }

const VoteState = types
  .model({
    is_voted: types.maybe(types.union(types.literal(1), types.literal(0))),
    vote_bad: types.maybe(types.number),
    vote_great: types.maybe(types.number)
  })
  .views((self) => {
    return {
      get totalVote() {
        return (self.vote_great || 0) - (self.vote_bad || 0);
      },
      get voteUpAction(): 1 | 0 | -1 {
        switch (self.is_voted) {
          case 1:
          case 0:
            return 0;
          case null:
            return 1;
          default:
            throw new TypeError('is_voted should be 1, 0 or null, but got ' + self.is_voted);
        }
      },
      get voteDownAction(): 1 | 0 | -1 {
        switch (self.is_voted) {
          case 1:
          case 0:
            return 0;
          case null:
            return -1;
          default:
            throw new TypeError('is_voted should be 1, 0 or null, but got ' + self.is_voted);
        }
      }
    };
  })
  .actions((self) => {
    return {
      applyVote(action: 1 | 0 | -1) {
        switch (action) {
          case 1:
            self.vote_great = (self.vote_great || 0) + 1;
            self.is_voted = 1;
            break;
          case -1:
            self.vote_bad = (self.vote_bad || 0) + 1;
            self.is_voted = 0;
            break;
          case 0:
            switch (self.is_voted) {
              case 1:
                self.vote_great = (self.vote_great || 0) - 1;
                break;
              case 0:
                self.vote_bad = (self.vote_bad || 0) - 1;
                break;
            }
            self.is_voted = null;
        }
      }
    };
  })
  .named('VoteState');

const AnswerState = types
  .compose(CommentState, VoteState, types.model({
    comment: types.array(CommentState),
    id: types.number
  }))
  .named('AnswerState');

type AnswerStateType = typeof AnswerState.Type;
export interface IAnswerState extends AnswerStateType { }

export const DiscussionDetail = types
  .compose(CommentState, VoteState, types.model({
    answer: types.array(AnswerState),
    ca_id: types.maybe(types.number),
    dis_id: types.number,
    prob_title: types.maybe(types.string),
    title: types.string
  }))
  .views((self) => {
    return {
      get id() {
        return self.dis_id;
      }
    };
  })
  .named('DiscussionDetail');

type DiscussionDetailType = typeof DiscussionDetail.Type;
export interface IDiscussionDetail extends DiscussionDetailType { }
