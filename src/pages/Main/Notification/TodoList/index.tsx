import React from 'react';
import { RouteConfigComponentProps } from 'react-router-config';
import withHeaderRoom from '../../../../components/header/HeaderRoom/decorator';
import { IGlobalStore } from '../../../../stores/Global';
import { ITodosStore } from '../../../../stores/Todos';

interface ITodosListProps extends RouteConfigComponentProps<{}> {
  $Global?: IGlobalStore;
  $Todos?: ITodosStore;
}
