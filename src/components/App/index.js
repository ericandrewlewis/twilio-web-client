import React, { Component } from 'react';
import { connect } from 'react-redux';
import style from './style.css';
import ConversationList from '../ConversationList';
import Conversation from '../Conversation';
import { loadConversations, loadMessagesById } from '../../actions';
import { getSelectedConversationId } from '../../reducers/conversations';
import io from 'socket.io-client';
const socket = io('http://localhost:3002');

const mapDispatchToProps = (dispatch) => {
  return {
    onMount: () => {
      dispatch(loadConversations());
      socket.on('updateMessage', ({id}) => {
        dispatch(loadMessagesById([id]));
      });
    }
  };
};

const mapStateToProps = (state) => {
  return {
    selectedConversationId: getSelectedConversationId(state)
  };
}

class App extends Component {
  componentWillMount() {
    this.props.onMount();
  }

  render() {
    return (
      <div className={style.app}>
        <ConversationList />
        {this.props.selectedConversationId ? <Conversation />: undefined}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
