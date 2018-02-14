import { Icon, Spin } from 'antd';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import styles from './index.module.less';

interface ILoadingProps {
  loading?: boolean;
  tip?: string;
  className?: string;
  fullScreen?: boolean;
}

@observer
export default class Loading extends React.Component<ILoadingProps> {

  @computed
  get wrapperClassNames() {
    const classNames: string[] = [ styles.loading ];
    const { loading, fullScreen, className } = this.props;
    if (!loading) {
      classNames.push(styles.hidden);
    }
    if (fullScreen) {
      classNames.push(styles.fullScreen);
    }
    if (className) {
      classNames.push(className);
    }
    return classNames.join(' ');
  }

  render() {
    const { loading, tip } = this.props;
    return (
      <div className={ this.wrapperClassNames }>
        <Spin
          spinning={ loading }
          tip={ tip }
          indicator={ <Icon type='loading' className={ styles.icon }/> }
        />
      </div>
    );
  }
}
