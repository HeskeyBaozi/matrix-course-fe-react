import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import styles from './index.module.less';

export interface IFooterLink {
  title: React.ReactNode;
  key: string;
  href: string;
  selfTarget?: boolean;
}

interface IGlobalFooterProps {
  links?: IFooterLink[];
  copyright?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

@observer
export default class GlobalFooter extends React.Component<IGlobalFooterProps> {

  @computed
  get Links() {
    const { links } = this.props;
    let map = null;
    if (links) {
      map = links.map(({ title, href, selfTarget, key }) => (
        <a
          key={ key }
          target={ selfTarget ? '_self' : '_blank' }
          href={ href }
        >
          { title }
        </a>
      ));
    }
    return links ? (
      <div className={ styles.links }>
        { map }
      </div>
    ) : null;
  }

  @computed
  get Copyright() {
    const { copyright } = this.props;
    return copyright ? (
      <div className={ styles.copyright }>{ copyright }</div>
    ) : null;
  }

  render() {
    const { className } = this.props;
    return (
      <div className={ `${styles.globalFooter} ${className}` }>
        { this.Links }
        { this.Copyright }
      </div>
    );
  }
}
