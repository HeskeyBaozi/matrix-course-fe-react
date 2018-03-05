import { Avatar } from 'antd';
import { format } from 'date-fns/esm';
import { observer } from 'mobx-react';
import React from 'react';
import Markdown from '../../../../../components/common/Markdown';
import { ICommentState } from '../../../../../stores/Discussion/type';
import styles from './index.module.less';

interface ICommentCardProps {
  item: ICommentState;
}

@observer
export default class CommentCard extends React.Component<ICommentCardProps> {
  render() {
    const { username, nickname, date, description } = this.props.item;
    return (
      <div>
        <div className={ styles.title }>
          <div className={ styles.avatarLeading }>
            <Avatar icon={ 'user' } src={ `/api/users/profile/avatar?username=${username}` } />
            <span style={ { marginLeft: '1rem' } }>{ nickname }</span>
          </div>
          <span className={ styles.discription }>
            { `回复于 ${format(date, 'HH:mm YYYY-MM-DD')}` }
          </span>
        </div>
        <Markdown source={ description } />
      </div>
    );
  }
}
