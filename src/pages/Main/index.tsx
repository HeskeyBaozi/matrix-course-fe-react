import { Layout } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import { RouteConfigComponentProps } from 'react-router-config';

interface IMainProps extends RouteConfigComponentProps<{}> {

}

@observer
export default class Main extends React.Component<IMainProps> {
  render() {
    return (
      <Layout>
        { 'Sider' }
        <Layout>
          { 'Header' }
          { 'Content' }
        </Layout>
      </Layout>
    );
  }
}
