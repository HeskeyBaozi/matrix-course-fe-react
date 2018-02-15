import { observer } from 'mobx-react';
import React from 'react';
import styles from './index.module.less';

interface IFieldProps {
  bordered?: boolean;
  title: React.ReactNode;
  value: React.ReactNode;
}

@observer
export default class Field extends React.Component<IFieldProps> {
  render() {
    const { title, value, bordered } = this.props;
    return (
      <div className={ styles.infoWrapper }>
        { title }
        <p className={ styles.infoValue }>{ value }</p>
        { bordered && <em /> }
      </div>
    );
  }
}
