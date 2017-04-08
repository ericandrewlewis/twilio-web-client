import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectConversation } from '../../../../actions';
import style from './style.css';
import { getSelectedConversationId } from '../../../../reducers/conversations';
import classNames from 'classnames';

const mapStateToProps = (state, ownProps) => {
  return {
    active: getSelectedConversationId(state) === ownProps.conversation._id
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(
        selectConversation(ownProps.conversation._id)
      )
    }
  };
}

class ConversationListItem extends Component {
  render() {
    const {conversation, active} = this.props;
    const classes = classNames(style.conversationListItem,
      {
        [style.active]: active
      }
    );
    return (
      <div className={classes} onClick={this.props.onClick}>
        <h2>{conversation.with}</h2>
        <p>{conversation.lastMessage}</p>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConversationListItem);
