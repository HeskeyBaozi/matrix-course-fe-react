import { Avatar, Button, Card, Divider, Icon, Input, List, Tooltip } from 'antd';
import { format } from 'date-fns/esm';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { SyntheticEvent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import Markdown from '../../../../components/common/Markdown';
import VoteBox from '../../../../components/common/VoteBox';
import { IDiscussionStore } from '../../../../stores/Discussion';
import { IAnswerState, ICommentState } from '../../../../stores/Discussion/type';
import CommentCard from './CommentCard';

interface IAnswerCardProps extends RouteComponentProps<{ course_id: string, discussion_id: string }> {
  $Discussion?: IDiscussionStore;
  item: IAnswerState;
}

@inject('$Discussion')
@observer
class AnswerCard extends React.Component<IAnswerCardProps> {

  static renderItem(item: ICommentState) {
    return (
      <List.Item>
        <CommentCard item={ item } />
      </List.Item>
    );
  }

  @observable
  isCommentsShown = false;

  @observable
  replyText = '';

  @observable
  currentPage = 1;

  @computed
  get limit() {
    return 120;
  }

  @action
  handlePaginationChange = (next: number) => {
    this.currentPage = next;
  }

  @action
  handleReplyChange = (e: SyntheticEvent<HTMLTextAreaElement>) => {
    this.replyText = e.currentTarget.value;
  }

  @computed
  get canReply() {
    return this.replyText.length > 0 && this.replyText.length <= this.limit;
  }

  @computed
  get pagination() {
    const { comment } = this.props.item;
    return {
      showQuickJumper: true,
      current: this.currentPage,
      pageSize: 8,
      size: 'small',
      total: comment && comment.length || 0,
      onChange: this.handlePaginationChange
    };
  }

  @computed
  get pagedDataSource() {
    const { comment } = this.props.item;
    const { pageSize, total } = this.pagination;
    const offset = (this.currentPage - 1) * pageSize;
    return comment
      .slice(offset, offset + pageSize >= total ? total : offset + pageSize);
  }

  @computed
  get commentsStyle() {
    return {
      marginTop: '1rem',
      display: this.isCommentsShown && 'block' || 'none'
    };
  }

  @action
  handleCommentsShownChange = () => {
    this.isCommentsShown = !this.isCommentsShown;
  }

  handleClickVote = async (voteAction: 1 | 0 | -1) => {
    const { $Discussion, match: { params: { course_id, discussion_id } } } = this.props;
    const { id } = this.props.item;
    const args = {
      course_id: Number.parseInt(course_id),
      discussion_id: Number.parseInt(discussion_id)
    };
    const body = { id, action: voteAction };
    await $Discussion!.VoteAnswerAsync(args, body);
  }

  render() {
    const { username, nickname, date, description, is_voted, vote_bad, vote_great, comment } = this.props.item;
    const { $Discussion } = this.props;
    return (
      <Card>
        <Card.Meta
          avatar={ <Avatar icon={ 'user' } src={ `/api/users/profile/avatar?username=${username}` } /> }
          title={ nickname }
          description={ `回复于 ${format(date, 'HH:mm A, Do MMMM YYYY')}` }
        />
        <Divider />
        <Markdown source={ description || '' } />
        <Divider />
        <div style={ { display: 'flex', alignItems: 'center' } }>
          <VoteBox
            onClick={ this.handleClickVote }
            loading={ !$Discussion!.detail || $Discussion!.$loading.get('VoteAnswerAsync') }
            isVoted={ is_voted }
            voteUp={ vote_great || 0 }
            voteDown={ vote_bad || 0 }
          />
          <Button
            style={ { marginLeft: '1rem' } }
            icon={ 'message' }
            type={ 'ghost' }
            onClick={ this.handleCommentsShownChange }
          >{ `${comment.length} 条回复` }
          </Button>
        </div>
        <div style={ this.commentsStyle }>
          <List
            itemLayout={ 'vertical' }
            size={ 'small' }
            bordered={ true }
            pagination={ this.pagination }
            dataSource={ this.pagedDataSource }
            renderItem={ AnswerCard.renderItem }
          />
          <Input.TextArea
            style={ { marginTop: '1rem' } }
            autosize={ true }
            placeholder={ `回复层主 ( ${this.limit}字符以内 )` }
            value={ this.replyText }
            onChange={ this.handleReplyChange }
          />
          <Button
            style={ { marginTop: '1rem', marginRight: '1rem' } }
            icon={ 'upload' }
            type={ 'primary' }
            disabled={ !this.canReply }
          >提交
          </Button>
          <Tooltip title={ `当前${this.replyText.length}字符, ${this.canReply ? '可' : '不可'}提交` } placement={ 'right' }>
            <Icon type={ 'question-circle-o' } />
          </Tooltip>
        </div>
      </Card>
    );
  }
}

export default withRouter(AnswerCard);
