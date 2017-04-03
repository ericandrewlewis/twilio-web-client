import React, { Component } from 'react';
import { connect } from 'react-redux';
import style from './style.css';
import ConversationList from '../ConversationList';
import Conversation from '../Conversation';
import { loadConversations, loadMessages } from '../../actions';
import { getSelectedConversationId } from '../../reducers/conversations';

const mapDispatchToProps = (dispatch) => {
  return {
    onMount: () => {
      dispatch(loadConversations());
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
