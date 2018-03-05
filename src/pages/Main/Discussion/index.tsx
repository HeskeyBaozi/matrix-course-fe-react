import { Avatar } from 'antd';
import { format } from 'date-fns/esm';
import { autorun, computed } from 'mobx';
import { inject, observer, Provider } from 'mobx-react';
import { destroy } from 'mobx-state-tree';
import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Link } from 'react-router-dom';
import { IDescriptionItem } from '../../../components/common/Descriptions';
import PageContainer from '../../../components/common/PageHeader/pageContainer';
import withHeaderRoom from '../../../components/header/HeaderRoom/decorator';
import { DiscussionStore, IDiscussionStore } from '../../../stores/Discussion';
import { IGlobalStore } from '../../../stores/Global';

interface IOneDiscussionProps extends RouteConfigComponentProps<{ course_id: string, discussion_id: string }> {
  $Global?: IGlobalStore;
}

@inject('$Global')
@withHeaderRoom<IOneDiscussionProps>(() => '讨论详情')
@observer
export default class OneCourse extends React.Component<IOneDiscussionProps> {

  $Discussion: IDiscussionStore = DiscussionStore.create();

  disposer = autorun(() => {
    const { $Global } = this.props;
    if (this.$Discussion.detail && this.$Discussion.detail!.title) {
      $Global!.setHeaderText(this.$Discussion.detail!.title);
    }
  });

  @computed
  get title() {
    const { $Global } = this.props;
    return this.$Discussion.detail && this.$Discussion.detail!.title || '讨论详情';
  }

  @computed
  get meta(): IDescriptionItem[] {
    return this.$Discussion.detail && [
      {
        term: '来自',
        key: 'from',
        icon: 'user',
        value: this.$Discussion.detail!.nickname
      },
      {
        term: '来自课程',
        key: 'course',
        icon: 'book',
        value: this.$Discussion.fromCourse && this.$Discussion.fromCourse!.name || ''
      },
      {
        term: '相关题目',
        key: 'related-problem',
        icon: 'link',
        value: <Link to={ '#' }>{ this.$Discussion.detail!.prob_title }</Link>
      }
    ] || [];
  }

  @computed
  get Avatar() {
    let src: string | undefined;
    if (this.$Discussion.detail) {
      src = `/api/users/profile/avatar?username=${this.$Discussion.detail!.username}`;
    }
    return (
      <Avatar icon={ 'user' } src={ src } />
    );
  }

  async componentDidMount() {
    const { $Global, match } = this.props;
    const args = {
      course_id: Number.parseInt(match.params.course_id),
      discussion_id: Number.parseInt(match.params.discussion_id)
    };
    await Promise.all([
      this.$Discussion.LoadDetailAsync(args)
    ]);
  }

  componentWillUnmount() {
    this.disposer();
    destroy(this.$Discussion);
  }

  render() {
    const { route } = this.props;
    return (
      <Provider $Discussion={ this.$Discussion }>
        <PageContainer
          title={ this.title }
          loading={ this.$Discussion.$loading.get('LoadDetailAsync') }
          dataSource={ this.meta }
          logo={ this.Avatar }
        >
          { renderRoutes(route!.routes) }
        </PageContainer>
      </Provider>
    );
  }
}
