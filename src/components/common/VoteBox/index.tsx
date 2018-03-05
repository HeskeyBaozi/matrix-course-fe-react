import { Button } from 'antd';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

interface IVoteBoxProps {
  isVoted: number | null;
  voteUp: number;
  voteDown: number;
  loading?: boolean;
  onClick: (voteAction: 1 | 0 | -1) => any;
}

@observer
export default class VoteBox extends React.Component<IVoteBoxProps> {

  @computed
  get voteUpButtonType() {
    switch (this.props.isVoted) {
      case 1:
        return 'primary';
      case 0:
      case null:
        return void 0;
    }
  }

  @computed
  get voteUpButtonIcon() {
    switch (this.props.isVoted) {
      case 1:
        return 'like';
      default:
        return 'like-o';
    }
  }

  @computed
  get voteUpButtonStyle() {
    if (this.props.isVoted === 1) {
      return {
        backgroundColor: '#5c5c5c',
        borderColor: '#5c5c5c'
      };
    }
  }

  @computed
  get voteDownButtonType() {
    switch (this.props.isVoted) {
      case 0:
        return 'danger';
      case 1:
      case null:
        return void 0;
    }
  }

  @computed
  get voteDownButtonIcon() {
    switch (this.props.isVoted) {
      case 0:
        return 'dislike';
      default:
        return 'dislike-o';
    }
  }

  handleClickUp = () => {
    const { isVoted, onClick } = this.props;
    switch (isVoted) {
      case 1:
      case 0:
        return onClick(0);
      case null:
        return onClick(1);
    }
  }

  handleClickDown = () => {
    const { isVoted, onClick } = this.props;
    switch (isVoted) {
      case 1:
      case 0:
        return onClick(0);
      case null:
        return onClick(-1);
    }
  }

  render() {
    const { voteUp, loading } = this.props;
    return (
      <Button.Group>
        <Button
          loading={ loading }
          type={ this.voteUpButtonType }
          icon={ this.voteUpButtonIcon }
          style={ this.voteUpButtonStyle }
          onClick={ this.handleClickUp }
        >
          <span style={ { marginLeft: '1rem' } }>{ voteUp }</span>
        </Button>
        <Button
          loading={ loading }
          type={ this.voteDownButtonType }
          icon={ this.voteDownButtonIcon }
          onClick={ this.handleClickDown }
        />
      </Button.Group>
    );
  }
}
