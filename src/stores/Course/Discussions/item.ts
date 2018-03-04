import { types } from 'mobx-state-tree';

export const DiscussionItem = types
  .model({
    answers: types.maybe(types.number),
    ca_id: types.maybe(types.number),
    date: types.string,
    id: types.identifier(types.number),
    lastDate: types.maybe(types.string),
    nickname: types.maybe(types.string),
    prob_title: types.maybe(types.string),
    prob_type: types.maybe(types.string),
    title: types.string,
    username: types.string,
    vote_bad: types.maybe(types.number),
    vote_great: types.maybe(types.number)
  })
  .named('DiscussionItem');

type DiscussionItemType = typeof DiscussionItem.Type;
export interface IDiscussionItem extends DiscussionItemType { }
