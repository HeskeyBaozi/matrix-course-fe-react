import { Avatar, Card, Icon } from 'antd';
import { formatDistance } from 'date-fns/esm';
import { computed } from 'mobx';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import IconText from 'src/components/common/IconText';
import Descriptions, { IDescriptionItem } from '../../../../components/common/Descriptions';
import { IDiscussionItem } from '../../../../stores/Course/Discussions/item';
import styles from './index.module.less';

interface IDiscussionCardProps extends RouteComponentProps<{ course_id: string }> {
  item: IDiscussionItem;
}

class DiscussionCard extends React.Component<IDiscussionCardProps> {

  @computed
  get dataSource() {
    const {
      date,
      lastDate,
      ca_id,
      prob_title,
      nickname
    } = this.props.item;

    const descriptions: IDescriptionItem[] = [
      {
        term: '来自',
        key: 'from',
        icon: 'user',
        value: nickname || '未知用户'
      },
      {
        term: '最近讨论于',
        key: 'post',
        icon: 'calendar',
        value: formatDistance(lastDate || date, Date.now()) + ' ago'
      }
    ];

    if (ca_id) {
      descriptions.push({
        term: '相关题目',
        key: 'related-problem',
        icon: 'link',
        value: <Link to={ '#' }>{ prob_title }</Link>
      });
    }

    return descriptions;
  }

  @computed
  get Actions() {
    const { vote_great, answers, id } = this.props.item;
    const { course_id } = this.props.match.params;
    return [ (
      <span key={ 'likes' }>
        <Icon type={ 'like-o' } /> { (vote_great || 0) } 个赞同
      </span>), (
      <Link to={ `/course/${course_id}/discussion/${id}` } key={ 'answers' }>
        <Icon type={ 'message' } /> { answers || 0 } 个回复
      </Link>
    ) ];
  }

  @computed
  get Title() {
    const { title, username, id } = this.props.item;
    const { course_id } = this.props.match.params;
    return (
      <div className={ styles.cardTitle }>
        <Avatar
          icon={ 'user' }
          src={ `/api/users/profile/avatar?username=${username}` }
        />
        <Link to={ `/course/${course_id}/discussion/${id}` }>
          { title }
        </Link>
      </div>
    );
  }

  render() {
    const { course_id } = this.props.match.params;
    const { prob_title } = this.props.item;
    return (
      <Card actions={ this.Actions } title={ this.Title } className={ styles.actionsDefault } >
        <Descriptions dataSource={ this.dataSource } col={ 2 } />
      </Card>
    );
  }
}

export default withRouter(DiscussionCard);
