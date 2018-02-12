import { computed } from 'mobx';
import { observer } from 'mobx-react';
import 'particles.js';
import React from 'react';
import particlesConfig from '../../assets/jsons/particlesjs-config.json';
import styles from './index.module.css';

declare const particlesJS: (id: string, config: object) => void;
declare const pJSDom: any[];

@observer
export default class Particles extends React.Component<{}> {

  @computed
  get id() {
    return ('matrix-particles-app').toUpperCase();
  }

  componentDidMount() {
    particlesJS(this.id, particlesConfig);
  }

  componentWillUnmount() {
    if (Array.isArray(pJSDom) && pJSDom.length) {
      pJSDom.forEach((pJS) => {
        pJS.pJS.fn.vendors.destroypJS();
      });

      while (Array.isArray(pJSDom) && pJSDom.length) {
        pJSDom.pop();
      }
    }
  }

  render() {
    return <div id={ this.id } className={ styles.particles }/>;
  }
}
