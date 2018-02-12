import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

interface IAuthorizedProps {
  current: string;
  authority: string[];
  Exception: React.ReactNode;
}

@observer
export default class Authorized extends React.Component<IAuthorizedProps> {

  @computed
  get View() {
    const { children, Exception, authority, current } = this.props;
    return authority.some((auth) => auth === current) ? children : Exception;
  }

  render() {
    return this.View;
  }
}
