import React, { Component } from 'react';
import { connect } from 'react-redux';
import ConversationListItem from './components/ConversationListItem';
import style from './style.css';
import {getConversations} from '../../reducers/conversations';
import { createNewConversation, selectConversation } from '../../actions';

function orderConversations(conversations) {
  return conversations.sort((a, b) => {
    if (a._id === 'new') {
      return -1;
    }
    if (b._id === 'new') {
      return 1;
    }
    return 0;
  });
}
const mapStateToProps = (state) => {
  return {
    conversations: orderConversations(
      getConversations(state)
    )
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    newConversation() {
      dispatch(createNewConversation());
      dispatch(selectConversation('new'));
    }
  }
}

class ConversationList extends Component {
  render() {
    const {conversations, newConversation} = this.props;
    return (
      <div className={style.conversationList}>
        <div className={style.conversationListButtons}><button onClick={newConversation} type="button">New Message</button></div>
        <div>
          {this.props.conversations.map((conversation, index) => {
            return <ConversationListItem key={index} conversation={conversation} />;
          })}
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConversationList);
