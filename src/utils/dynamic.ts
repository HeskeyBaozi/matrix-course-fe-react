import React from 'react';
import Loadable from 'react-loadable';

function none() {
  return null;
}

type Resolver = () => Promise<React.ComponentType<any> | { default: React.ComponentType<any> }>;

export function dynamic(resolve: Resolver) {
  return Loadable({
    loader: resolve,
    loading: none
  });
}
