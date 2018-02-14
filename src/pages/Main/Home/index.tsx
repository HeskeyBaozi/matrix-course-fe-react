import { Col, Row } from 'antd';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { RouteConfigComponentProps } from 'react-router-config';
import UserCard from './UserCard';

interface IHomeProps extends RouteConfigComponentProps<{}> {

}

@observer
export default class Home extends React.Component<IHomeProps> {

  @computed
  get colProps() {
    return { xs: 24, sm: 24, md: 12, lg: 12, xl: 6, style: { marginBottom: '1rem' } };
  }

  render() {
    return (
      <Row gutter={ 16 }>
        <Col { ...this.colProps } xl={ 12 }>
          <UserCard />
        </Col>
        <Col { ...this.colProps }>
          123
        </Col>
        <Col { ...this.colProps }>
          456
        </Col>
      </Row>
    );
  }
}
