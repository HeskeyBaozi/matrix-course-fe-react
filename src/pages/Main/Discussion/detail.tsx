import { Avatar, Card, Col, Divider, List, Row, Select } from 'antd';
import { format } from 'date-fns/esm';
import { action, computed, expr, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { RouteConfigComponentProps } from 'react-router-config';
import Loading from '../../../components/common/Loading';
import Markdown from '../../../components/common/Markdown';
import VoteBox from '../../../components/common/VoteBox';
import { DiscussionStore, IDiscussionStore } from '../../../stores/Discussion';
import { IAnswerState } from '../../../stores/Discussion/type';
import AnswerCard from './AnswerCard';

interface IOneDiscussionDetailProps extends RouteConfigComponentProps<{ course_id: string, discussion_id: string }> {
  $Discussion?: IDiscussionStore;
}

type SorterType = 'default' | 'hot';

@inject('$Discussion')
@observer
export default class OneDiscussionDetail extends React.Component<IOneDiscussionDetailProps> {

  static renderItem(item: IAnswerState) {
    return (
      <List.Item>
        <AnswerCard item={ item } />
      </List.Item>
    );
  }

  @observable
  sorter: SorterType = 'default';

  @observable
  currentPage = 1;

  @action
  handlePaginationChange = (next: number) => {
    this.currentPage = next;
  }

  @action
  handleSorterChange = (value: any) => {
    this.sorter = value as SorterType;
  }

  handleClickVote = async (voteAction: 1 | 0 | -1) => {
    const { $Discussion, match: { params: { course_id, discussion_id } } } = this.props;
    const args = {
      course_id: Number.parseInt(course_id),
      discussion_id: Number.parseInt(discussion_id)
    };
    const body = {
      id: $Discussion!.detail && $Discussion!.detail!.id || args.discussion_id,
      action: voteAction
    };
    await $Discussion!.VoteAsync(args, body);
  }

  @computed
  get dataSource() {
    const { $Discussion } = this.props;
    if ($Discussion!.detail) {
      switch (this.sorter) {
        case 'hot':
          return $Discussion!.detail!.answer.sort((left, right) => right.totalVote - left.totalVote);
        case 'default':
        default:
          return $Discussion!.detail!.answer;
      }
    }
  }

  @computed
  get pagedDataSource() {
    if (this.dataSource) {
      const { pageSize, total } = this.pagination;
      const offset = (this.currentPage - 1) * pageSize;
      return this.dataSource
        .slice(offset, offset + pageSize >= total ? total : offset + pageSize);
    }
  }

  @computed
  get Main() {
    const { $Discussion } = this.props;
    const src = expr(() => $Discussion!.detail
      && `/api/users/profile/avatar?username=${$Discussion!.detail!.username}` || void 0);
    return (
      <Card key={ 'main' } style={ { marginBottom: '1rem' } }>
        <Card.Meta
          avatar={ <Avatar icon={ 'user' } src={ src } /> }
          title={ $Discussion!.detail && $Discussion!.detail!.nickname || '' }
          description={ `发布于 ${$Discussion!.detail! && format($Discussion!.detail!.date, 'HH:mm A, Do MMMM YYYY')}` }
        />
        <Divider />
        <Markdown source={ $Discussion!.detail && $Discussion!.detail!.description || '' } />
        <Divider />
        <VoteBox
          onClick={ this.handleClickVote }
          loading={ !$Discussion!.detail || $Discussion!.$loading.get('VoteAsync') }
          isVoted={ $Discussion!.detail && $Discussion!.detail!.is_voted }
          voteUp={ $Discussion!.detail && $Discussion!.detail!.vote_great || 0 }
          voteDown={ $Discussion!.detail && $Discussion!.detail!.vote_bad || 0 }
        />
      </Card>
    );
  }

  @computed
  get AnswersFilter() {
    const { $Discussion } = this.props;
    const answersCount = expr(() => $Discussion!.detail && $Discussion!.detail!.answer.length || 0);
    return (
      <Card key={ 'filter' } style={ { marginBottom: '1rem' } } >
        <Row gutter={ 16 }>
          <Col span={ 12 }>
            <div style={ { fontSize: '1rem' } }>{ answersCount } 个回答</div>
          </Col>
          <Col push={ 3 } span={ 9 }>
            <Select style={ { width: '100%' } } value={ this.sorter } onChange={ this.handleSorterChange }>
              <Select.Option value={ 'default' }>
                默认排序
              </Select.Option>
              <Select.Option value={ 'hot' }>
                热门排序
              </Select.Option>
            </Select>
          </Col>
        </Row>
      </Card>
    );
  }

  @computed
  get pagination() {
    return {
      showQuickJumper: true,
      current: this.currentPage,
      pageSize: 12,
      size: 'small',
      total: this.dataSource && this.dataSource.length || 0,
      onChange: this.handlePaginationChange
    };
  }

  @computed
  get List() {
    const { $Discussion } = this.props;
    return (
      <div key={ 'list' } style={ { position: 'relative' } }>
        <Loading loading={ !$Discussion!.detail || $Discussion!.$loading.get('LoadDetailAsync') } />
        <List
          pagination={ this.pagination }
          grid={ { md: 1 } }
          dataSource={ this.pagedDataSource }
          renderItem={ OneDiscussionDetail.renderItem }
        />
      </div>
    );
  }

  render() {
    return [
      this.Main,
      this.AnswersFilter,
      this.List
    ];
  }
}
