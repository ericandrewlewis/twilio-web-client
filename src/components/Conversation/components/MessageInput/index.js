import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createMessage } from '../../../../actions';
import { getConversationById, getSelectedConversationId } from '../../../../reducers/conversations';
import style from './style.css';

const mapStateToProps = (state) => {
  const conversation = getConversationById(
    state,
    getSelectedConversationId(state)
  );
  let to;
  if (conversation) {
    to = conversation.with;
  }
  return {
    to,
    conversationId: conversation._id
  };
}

const mapDispatchToProps = (dispatch) => {
  return {dispatch};
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return Object.assign({}, ownProps, stateProps, {
    createMessage: (message) => {
      dispatchProps.dispatch(createMessage({
        to: stateProps.to,
        content: message,
        conversationId: stateProps.conversationId
      }));
    }
  });
}
class MessageInput extends Component {
  _handleKeyPress(event) {
    if (event.key === 'Enter') {
      if (event.target.value) {
        this.props.createMessage(event.target.value);
      }
    }
  }

  render() {
    return (
      <div>
        <input className={style.input} onKeyPress={(event) => this._handleKeyPress(event)} type="text" />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(MessageInput);
