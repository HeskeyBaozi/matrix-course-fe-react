import { Card, Icon, Input } from 'antd';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { RouteConfigComponentProps } from 'react-router-config';
import withHeaderRoom from '../../../../components/header/HeaderRoom/decorator';
import { IGlobalStore } from '../../../../stores/Global';
import { ITodosStore } from '../../../../stores/Todos';

interface ITodosListProps extends RouteConfigComponentProps<{}> {
  $Global?: IGlobalStore;
  $Todos?: ITodosStore;
}

@inject('$Global', '$Todos')
@withHeaderRoom<ITodosListProps>((props) => '所有待办')
@observer
export default class TodoList extends React.Component<ITodosListProps> {

  @computed
  get Filter() {
    return (
      <Card
        style={ { marginBottom: '1.5rem', textAlign: 'center' } }
        key={ 'filter' }
      >
        <Input
          style={ { maxWidth: '24rem' } }
          value={ 'this.filter.search' }
          placeholder={ '按名称或相关标题搜索' }
          prefix={ <Icon type={ 'search' } style={ { zIndex: -1 } } /> }
          onChange={ void 0 }
        />
      </Card>
    );
  }

  render() {
    return [
      this.Filter
    ];
  }
}
