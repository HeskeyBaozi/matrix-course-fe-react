import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Redirect } from 'react-router';
import { ILoginStore } from '../../../stores/Login';
import Authorized from '../../common/Authorized';
import { LoginStatus } from './enum';

interface ILoginAuthorizedProps {
  $Login?: ILoginStore;
  authority: LoginStatus[];
  redirectPath: string;
}

export * from './enum';

@inject('$Login')
@observer
export default class LoginAuthorized extends React.Component<ILoginAuthorizedProps> {

  @computed
  get current(): LoginStatus {
    const { $Login } = this.props;
    return $Login!.isLogin ? LoginStatus.User : LoginStatus.Guest;
  }

  @computed
  get Exception() {
    const { redirectPath } = this.props;
    return <Redirect to={ { pathname: redirectPath } }/>;
  }

  render() {
    const { children, authority } = this.props;
    return (
      <Authorized
        current={ this.current }
        authority={ authority }
        Exception={ this.Exception }
      >
        { children }
      </Authorized>
    );
  }
}
