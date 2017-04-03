import React, { Component } from 'react';
import { connect } from 'react-redux';
import ConversationListItem from './components/ConversationListItem';
import style from './style.css';
import {getConversations} from '../../reducers/conversations';

const mapStateToProps = (state) => {
  return {
    conversations: getConversations(state)
  };
};

class ConversationList extends Component {
  render() {
    const conversations = this.props.conversations;
    return (
      <div className={style.conversationList}>
        {this.props.conversations.map((conversation, index) => {
          return <ConversationListItem key={index} conversation={conversation} />;
        })}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  undefined
)(ConversationList);
