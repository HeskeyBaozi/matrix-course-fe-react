import { Col } from 'antd';
import { ColProps } from 'antd/es/grid/col';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import styles from './index.module.less';

interface IDescriptionProps {
  term: React.ReactNode;
  style?: React.CSSProperties;
  column: number;
  className?: string;
}

@observer
export default class Description extends React.Component<IDescriptionProps> {

  @computed
  get responsive(): { [ column: number ]: ColProps } {
    return {
      1: { xs: 24 },
      2: { xs: 24, sm: 12 },
      3: { xs: 24, sm: 12, md: 8 },
      4: { xs: 24, sm: 12, md: 6 }
    };
  }

  @computed
  get itemClassNames() {
    const { className } = this.props;
    const classNames = [ styles.description ];
    if (className) {
      classNames.push(className);
    }
    return classNames.join(' ');
  }

  render() {
    const { column, term, children } = this.props;
    return (
      <Col className={ this.itemClassNames } {...this.responsive[ column ]}>
        { term && <div className={ styles.term }>{ term }</div> }
        { children && <div className={ styles.detail }>{ children }</div> }
      </Col>
    );
  }
}
