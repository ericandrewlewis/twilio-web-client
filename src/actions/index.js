import { normalize } from 'normalizr';
import axios from 'axios';
import queryString from 'query-string';
import * as schema from './schema';
import SocketIO from 'socket.io-client';

const socket = SocketIO('http://localhost:3002');

export function createNewConversation() {
  return {
    type: 'NEW_CONVERSATION'
  };
}

function deselectConversation() {
  return {
    type: 'DESELECT_CONVERSATION'
  }
}

export function receiveConversations(conversations) {
  return {
    type: 'RECEIVE_CONVERSATIONS',
    conversations
  };
};

export function loadMessagesById(ids) {
  return (dispatch) => {
    axios(`/message?${queryString.stringify({ids})}`)
      .then((response) => {
        const messagesById = normalize(response.data, schema.arrayOfMessages).entities.messages;
        dispatch(
          receiveMessages(messagesById)
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };
}

export function loadConversations() {
  return (dispatch) => {
    axios.get('/conversation')
      .then((response) => {
        const conversationsById = normalize(response.data, schema.arrayOfConversations).entities.conversations;
        dispatch(
          receiveConversations(conversationsById)
        );
        loadMessagesById(
          Object.keys(conversationsById).map((id) => conversationsById[id].lastMessageId)
        )(dispatch);
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

function receiveMessages(messages) {
  return {
    type: 'RECEIVE_MESSAGES',
    messages
  };
};

function deleteNewConversation() {
  return {
    type: 'DELETE_NEW_CONVERSATION'
  };
}

export function selectConversation(id) {
  return (dispatch) => {
    dispatch(
      {
        type: 'SET_SELECTED_CONVERSATION',
        with: id
      }
    );
    if (id === 'new') {
      return;
    }
    axios(`/message?${queryString.stringify({conversationId: id})}`)
      .then((response) => {
        const messagesById = normalize(response.data, schema.arrayOfMessages).entities.messages;
        dispatch(
          receiveMessages(messagesById)
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

export function createMessage({content, to, conversationId}) {
  return (dispatch) => {
    axios.post('/message', {
      to,
      content,
      conversationId
    })
      .then((response) => {
        const messagesById = normalize([response.data], schema.arrayOfMessages).entities.messages;
        if (conversationId === 'new') {
          dispatch(deselectConversation());
          dispatch(deleteNewConversation());
          dispatch(loadConversations());
        }
        dispatch(
          receiveMessages(messagesById)
        );
      })
      .catch((error) => {
        console.error(error);
      })
  }
}
