import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router';
import Authorized from './index';

interface IAuthorizedRouteProps extends RouteProps {
  authority: string[];
  current: string;
  redirectPath: string;
}

@observer
export default class AuthorizedRoute extends React.Component<IAuthorizedRouteProps> {

  passRenderer = (props: RouteComponentProps<any>) => {
    const { component: Component, render } = this.props;
    return Component ? <Component { ...props }/> : (render && render(props) || null);
  }

  failRenderer = () => {
    const { redirectPath } = this.props;
    return (<Redirect to={ { pathname: redirectPath } }/>);
  }

  @computed
  get PassRoute() {
    const {
      component, render, authority, current, redirectPath, ...rest
    } = this.props;
    return (
      <Route { ...rest } render={ this.passRenderer }/>
    );
  }

  @computed
  get FailRoute() {
    const {
      component, render, authority, current, redirectPath, ...rest
    } = this.props;
    return (
      <Route { ...rest } render={ this.failRenderer }/>
    );
  }

  render() {
    const { authority, current } = this.props;
    return (
      <Authorized
        authority={ authority }
        current={ current }
        Exception={ this.FailRoute }
      >
        { this.PassRoute }
      </Authorized>
    );
  }
}
