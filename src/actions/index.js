import { normalize } from 'normalizr';
import axios from 'axios';
import queryString from 'query-string';
import * as schema from './schema';

function receiveConversations(conversations) {
  return {
    type: 'RECEIVE_CONVERSATIONS',
    conversations
  };
};

function loadMessagesById(ids) {
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

export function selectConversation(id) {
  return (dispatch) => {
    axios(`/message?${queryString.stringify({conversationId: id})}`)
      .then((response) => {
        const messagesById = normalize(response.data, schema.arrayOfMessages).entities.messages;
        dispatch(
          receiveMessages(messagesById)
        );
        dispatch(
          {
            type: 'SET_SELECTED_CONVERSATION',
            with: id
          }
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
        dispatch(
          receiveMessages(messagesById)
        );
      })
      .catch((error) => {
        console.error(error);
      })
  }
}
