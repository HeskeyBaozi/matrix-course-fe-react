import React from 'react';
import { IGlobalStore } from '../../../stores/Global';

export default function withHeaderRoom<T extends { $Global?: IGlobalStore }>(
  getHeaderText: <P = T>(props: P) => string
) {
  return ((Component: React.ComponentType<T>) => {
    return class WithHeaderRoom extends React.Component<T> {

      static displayName = `WithHeaderRoom(${Component.displayName})`;

      componentDidMount() {
        if (this.props.$Global) {
          this.props.$Global.setHeaderText(
            getHeaderText(this.props)
          );
        }
      }

      componentWillUnmount() {
        if (this.props.$Global) {
          this.props.$Global.resetHeaderText();
        }
      }

      render() {
        return (
          <Component {...this.props} />
        );
      }
    };
  }) as <C extends React.ComponentType<T>>(Component: C) => C;
}
