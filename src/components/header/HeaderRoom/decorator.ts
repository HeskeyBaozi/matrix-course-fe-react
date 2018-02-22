import React from 'react';
import { RouteConfigComponentProps } from 'react-router-config';
import { IGlobalStore } from '../../../stores/Global';

interface IInnerProps {
  $Global?: IGlobalStore;
}

export default function withHeaderRoom<T extends IInnerProps>(
  getHeaderText: (props: T) => string
) {
  return <C extends React.ComponentClass<T>>(Component: C): C => {

    class WithHeaderRoom extends React.Component<T> {

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
        return React.createElement(Component, this.props);
      }
    }

    return WithHeaderRoom as C;
  };
}
