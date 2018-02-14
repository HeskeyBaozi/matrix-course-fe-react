import { Avatar, Card } from 'antd';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import Descriptions from '../../../../components/common/Descriptions';
import { IProfileStore } from '../../../../stores/Profile';
import styles from './index.module.less';

interface IUserCard {
  $Profile?: IProfileStore;
}

@inject('$Profile')
@observer
export default class UserCard extends React.Component<IUserCard> {

  @computed
  get Cover() {
    const { $Profile } = this.props;
    return (
      <div
        className={ styles.coverAvatarWrapper }
        style={ { backgroundImage: `url(${$Profile!.avatarUrl})` } }
      >
        <Avatar className={ styles.coverAvatar } icon={ 'user' } src={ $Profile!.avatarUrl } />
      </div>
    );
  }

  @computed
  get Names() {
    const { $Profile } = this.props;
    return $Profile!.profile ? [
      <span key={ 'realname' } className={ styles.realname }>{ $Profile!.profile!.realname }</span>,
      <p key={ 'nickname' } className={ styles.nickname }>{ $Profile!.profile!.nickname }</p>
    ] : null;
  }

  render() {
    const { $Profile } = this.props;
    return (
      <Card
        loading={ !$Profile!.profile || $Profile!.$loading.get('LoadProfileAsync') }
        cover={ this.Cover }
      >
        { this.Names }
        <Descriptions dataSource={ $Profile!.baseInformationList } col={ 1 } />
      </Card>
    );
  }
}
