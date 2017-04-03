import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectConversation } from '../../../../actions';
import style from './style.css';

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
    const {conversation} = this.props;
    return (
      <div className={style.conversationListItem} onClick={this.props.onClick}>
        <h2>{conversation.with}</h2>
        <p>{conversation.lastMessage}</p>
      </div>
    );
  }
}

export default connect(
  undefined,
  mapDispatchToProps
)(ConversationListItem);
