declare module '*.less' {
  const content: {
    [ key: string ]: string
  };
  export default content;
}

declare module '*.css' {
  const content: {
    [ key: string ]: string
  };
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: object;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module 'react-headroom' {
  import React from 'react';
  interface IHeadroomProps {
    className?: string;
    parent?: (...args: any[]) => any;
    children: React.ReactNode;
    disableInlineStyles?: boolean;
    disable?: boolean;
    upTolerance?: number;
    downTolerance?: number;
    onPin?: () => any;
    onUnpin?: () => any;
    onUnfix?: () => any;
    wrapperStyle?: React.CSSProperties;
    pinStart?: number;
    style?: React.CSSProperties;
    calcHeightOnResize?: boolean;

  }

  export default class Headroom extends React.Component<IHeadroomProps> { }
}
