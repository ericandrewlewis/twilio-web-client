import React, { Component } from 'react';
import { connect } from 'react-redux';
import style from './style.css';
import ConversationItem from './components/ConversationItem';
import MessageInput from './components/MessageInput';
import { getSelectedConversationId } from '../../reducers/conversations';
import { getMessagesForConversationId } from '../../reducers/messages';

const mapStateToProps = (state) => {
  let messages = [];
  if (getSelectedConversationId(state)) {
    messages = getMessagesForConversationId(state, getSelectedConversationId(state));
  }
  return {
    messages
  };
}

class Conversation extends Component {


  render() {
    const {messages} = this.props;
    return (
      <div className={style.conversation}>
        <div className={style.conversationItemList}>
          {messages.map((message, index) => {
            return <ConversationItem key={index} message={message} />;
          })}
        </div>
        <MessageInput />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  undefined
)(Conversation);
