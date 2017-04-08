import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createMessage } from '../../../../actions';
import { getConversationById, getSelectedConversationId } from '../../../../reducers/conversations';
import style from './style.css';

const mapStateToProps = (state) => {
  if (getSelectedConversationId(state)) {
    const conversation = getConversationById(
      state,
      getSelectedConversationId(state)
    );
    return {
      to: conversation.with
    }
  }

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
  constructor(props) {
    super(props);
    this.state = {value: ''};
  }
  handleKeyPress(event) {
    if (event.key === 'Enter') {
      if (event.target.value) {
        this.props.createMessage(event.target.value);
        this.setState({value: ''});
      }
    }
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <div>
        <textarea
          type="text"
          className={style.input}
          value={this.state.value}
          onKeyPress={(event) => this.handleKeyPress(event)}
          onChange={(event) => this.handleChange(event)}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(MessageInput);
