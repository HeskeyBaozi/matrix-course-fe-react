import { Row } from 'antd';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import IconText from '../IconText';
import Description from './description';
import styles from './index.module.less';

export interface IDescriptionItem {
  term: React.ReactNode;
  key: string;
  icon: string;
  value: React.ReactNode;
}

interface IDescriptionsProps {
  dataSource: IDescriptionItem[];
  className?: string;
  layout?: 'horizontal' | 'vertical';
  col?: number;
  title?: React.ReactNode;
  gutter?: number;
  size?: 'large' | 'small';
  style?: React.CSSProperties;
}

@observer
export default class Descriptions extends React.Component<IDescriptionsProps> {

  @computed
  get containerClassNames() {
    const { className, layout = 'horizontal', size } = this.props;
    const classNames = [ styles.descriptionList ];
    if (className) {
      classNames.push(className);
    }
    if (layout) {
      classNames.push(styles[ layout ]);
    }
    if (size) {
      classNames.push(styles[ size ]);
    }
    return classNames.join(' ');
  }

  @computed
  get column() {
    const { col = 3 } = this.props;
    return col > 4 ? 4 : col;
  }

  @computed
  get List() {
    const { dataSource } = this.props;
    return dataSource.map(({ term, key, icon, value }) => (
      <Description key={ key } term={ <IconText icon={ icon } title={ term } gutter={ .5 } /> } column={ this.column }>
        { value }
      </Description>
    ));
  }

  render() {
    const { style, title = null, gutter } = this.props;
    return (
      <div className={ this.containerClassNames } style={ style }>
        { title ? <div className={ styles.title }>{ title }</div> : null }
        <Row gutter={ gutter }>
          { this.List }
        </Row>
      </div>
    );
  }
}
