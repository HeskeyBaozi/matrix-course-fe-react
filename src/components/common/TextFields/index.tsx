import { Col, Row } from 'antd';
import { ColProps } from 'antd/es/grid/col';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import IconText from '../IconText';
import Field from './field';

export interface ITextFieldItem {
  icon?: string;
  title: string;
  value: React.ReactNode;
}

interface ITextFieldsProps {
  colProps?: ColProps;
  dataSource: ITextFieldItem[];
}

@observer
export default class TextFields extends React.Component<ITextFieldsProps> {

  @computed
  get Map() {
    const { dataSource, colProps = { sm: 8, xs: 24 } } = this.props;
    return dataSource.map(({ icon, title, value }, index, arr) => (
      <Col key={ index } {...colProps}>
        <Field
          title={ <IconText icon={ icon } title={ title } /> }
          value={ value }
          bordered={ index !== arr.length - 1 }
        />
      </Col>
    ));
  }

  render() {
    return (
      <Row>
        { this.Map }
      </Row>
    );
  }
}
