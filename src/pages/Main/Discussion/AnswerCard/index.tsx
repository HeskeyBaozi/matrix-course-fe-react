import { Avatar, Button, Card, Divider, Form, Icon, Input, List, Mention, Tooltip } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { format } from 'date-fns/esm';
import { action, computed, expr, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { SyntheticEvent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { ICourseStore } from 'src/stores/Course';
import Markdown from '../../../../components/common/Markdown';
import VoteBox from '../../../../components/common/VoteBox';
import { IDiscussionStore } from '../../../../stores/Discussion';
import { IAnswerState, ICommentState } from '../../../../stores/Discussion/type';
import CommentCard from './CommentCard';

interface IAnswerCardProps extends RouteComponentProps<{ course_id: string, discussion_id: string }>,
  FormComponentProps {
  $Discussion?: IDiscussionStore;
  $Course?: ICourseStore;
  item: IAnswerState;
}

@inject('$Discussion', '$Course')
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
  currentPage = 1;

  @computed
  get limit() {
    return 100;
  }

  @action
  handlePaginationChange = (next: number) => {
    this.currentPage = next;
  }

  @computed
  get pagination() {
    const { comment } = this.props.item;
    return {
      showQuickJumper: true,
      current: this.currentPage,
      pageSize: 5,
      size: 'small',
      total: comment && comment.length || 0,
      onChange: this.handlePaginationChange
    };
  }

  @computed
  get lastPage() {
    return Math.ceil(this.pagination.total / this.pagination.pageSize);
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

  @computed
  get suggestions() {
    const { $Course } = this.props;
    return $Course!.members && $Course!.members!.map(({ nickname, username }) => nickname || username) || [];
  }

  checkMention = (rule: any, value: any, callback: any) => {
    const { getFieldValue } = this.props.form;
    const description = Mention.toString(getFieldValue('mention'));
    if (description.length > this.limit) {
      callback(new Error(`内容必须在${this.limit}字以内, 当前${description.length}字`));
    } else {
      callback();
    }
  }

  @computed
  get Mention() {
    const { form, $Discussion } = this.props;
    return form.getFieldDecorator('mention', {
      rules: [ { validator: this.checkMention }],
      initialValue: Mention.toContentState('')
    })(
      <Mention
        disabled={ $Discussion!.$loading!.get('CreateReplyAsync') }
        suggestions={ this.suggestions.slice() }
        placeholder={ `回复层主 ( ${this.limit}字符以内 )` }
      />
      );
  }

  handleSubmit = () => {
    const { form, $Course, $Discussion, item, match } = this.props;
    form.validateFields(async (errors, values) => {
      if (!errors && values.mention) {
        const args = {
          course_id: Number.parseInt(match.params.course_id),
          discussion_id: Number.parseInt(match.params.discussion_id)
        };
        const description = Mention.toString(values.mention);
        const users = (Mention.getMentions(values.mention) as string[])
          .map((mentionName) => {
            const nickname = mentionName.replace(/^@/, '');
            return $Course!.members && $Course!.members!.find((one) => one.nickname === nickname);
          })
          .filter((target) => target)
          .map((target) => target!.user_id);
        await $Discussion!.CreateReplyAsync(args, {
          id: item.id,
          description,
          users
        });
        form.resetFields();
        this.handlePaginationChange(this.lastPage);
      }
    });
  }

  render() {
    const { username, nickname, date, description, is_voted, vote_bad, vote_great, comment } = this.props.item;
    const { $Discussion, $Course } = this.props;
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
          <Form style={ { marginTop: '1rem' } }>
            <Form.Item>
              { this.Mention }
              <Button
                style={ { marginTop: '1rem', marginRight: '1rem' } }
                icon={ 'upload' }
                type={ 'primary' }
                loading={ $Discussion!.$loading!.get('CreateReplyAsync') }
                onClick={ this.handleSubmit }
              >
                提交
              </Button>
              <Tooltip title={ `${this.limit}字符以内才可提交` } placement={ 'right' }>
                <Icon type={ 'question-circle-o' } />
              </Tooltip>
            </Form.Item>
          </Form>
        </div>
      </Card>
    );
  }
}

export default Form.create()(withRouter(AnswerCard));
