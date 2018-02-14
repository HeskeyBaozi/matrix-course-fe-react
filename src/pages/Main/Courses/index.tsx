import { observer } from 'mobx-react';
import React from 'react';
import { RouteConfigComponentProps } from 'react-router-config';

interface ICoursesProps extends RouteConfigComponentProps<{}> {

}

@observer
export default class Courses extends React.Component<ICoursesProps> {
  render() {
    return (
      <h1>Courses</h1>
    );
  }
}
