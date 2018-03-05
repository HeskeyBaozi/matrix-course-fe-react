import { Avatar, Card, Divider } from 'antd';
import { format } from 'date-fns/esm';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import Markdown from '../../../../components/common/Markdown';
import VoteBox from '../../../../components/common/VoteBox';
import { IDiscussionStore } from '../../../../stores/Discussion';
import { IAnswerState } from '../../../../stores/Discussion/type';

interface IAnswerCardProps extends RouteComponentProps<{ course_id: string, discussion_id: string }> {
  $Discussion?: IDiscussionStore;
  item: IAnswerState;
}

@inject('$Discussion')
@observer
class AnswerCard extends React.Component<IAnswerCardProps> {

  handleClickVote = async (action: 1 | 0 | -1) => {
    const { $Discussion, match: { params: { course_id, discussion_id } } } = this.props;
    const { id } = this.props.item;
    const args = {
      course_id: Number.parseInt(course_id),
      discussion_id: Number.parseInt(discussion_id)
    };
    const body = { id, action };
    await $Discussion!.VoteAnswerAsync(args, body);
  }

  render() {
    const { username, nickname, date, description, is_voted, vote_bad, vote_great } = this.props.item;
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
        <VoteBox
          onClick={ this.handleClickVote }
          loading={ !$Discussion!.detail || $Discussion!.$loading.get('VoteAnswerAsync') }
          isVoted={ is_voted }
          voteUp={ vote_great || 0 }
          voteDown={ vote_bad || 0 }
        />
      </Card>
    );
  }
}

export default withRouter(AnswerCard);
