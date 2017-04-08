import React, { Component } from 'react';
import { connect } from 'react-redux';
import style from './style.css';
import ConversationItem from './components/ConversationItem';
import MessageInput from './components/MessageInput';
import { getSelectedConversationId, getConversationById } from '../../reducers/conversations';
import { getMessagesForConversationId } from '../../reducers/messages';

const mapStateToProps = (state) => {
  let messages = [];
  if (getSelectedConversationId(state)) {
    messages = getMessagesForConversationId(state, getSelectedConversationId(state));
  }
  return {
    conversation: getConversationById(state, getSelectedConversationId(state)),
    messages
  };
}

const animate = (callback, duration) => {
  let cancelled = false;
  let start = null;
  const stepper = (timestamp) => {
    if (!start) start = timestamp;
    let msSinceStart = timestamp - start;
    if (msSinceStart > duration) msSinceStart = duration;
    callback(msSinceStart / duration);
    if (msSinceStart < duration) {
      window.requestAnimationFrame(stepper);
    }
  }
  window.requestAnimationFrame(stepper);
  return {
    cancel: () => {
      cancelled = true;
    }
  }
}

class Conversation extends Component {
  componentDidMount() {
    const el = this.conversationItemList;
    el.scrollTop = el.scrollHeight - el.clientHeight;
  }

  // When a new message comes in, scroll the conversation to the bottom.
  componentDidUpdate(prevProps) {
    const latestMessage = this.props.messages[this.props.messages.length-1];
    const prevLatestMessage = prevProps.messages[prevProps.messages.length-1];
    if (!latestMessage || !prevLatestMessage) {
      return;
    }
    if (latestMessage.date > prevLatestMessage.date) {
      const el = this.conversationItemList;
      const start = el.scrollTop;
      animate((progress) => {
        const final = el.scrollHeight - el.clientHeight - start;
        el.scrollTop = start + (final * progress);
      }, 200);
    }
  }

  renderHeader() {
    const {conversation} = this.props;
    if (conversation._id === 'new') {
      return (
        <div>To: <input /></div>
      );
    }
    return (
      <div>To: {conversation.with}</div>
    );
  }

  renderMessages() {
    const {messages} = this.props;
    return (
      <div className={style.conversationItemList} ref={(div) => { this.conversationItemList = div; }}>
        {messages.map((message, index) => {
          return <ConversationItem key={index} message={message} />;
        })}
      </div>
    );
  }

  render() {
    const {conversation} = this.props;
    return (
      <div className={style.conversation}>
        {this.renderHeader()}
        {this.renderMessages()}
        <MessageInput />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  undefined
)(Conversation);
