import { getConversationById } from './conversations';

export function messages(state = {}, action) {
  switch(action.type) {
    case 'RECEIVE_MESSAGES':
      return {
        ...state,
        ...action.messages
      };
    default:
      return state;
  }
}

export function getMessages(state) {
  return Object.keys(state.messages.byId).map((id) => state.messages.byId[id]);
}

export function getMessagesForConversationId(state, id) {
  const conversation = getConversationById(state, id);
  return getMessages(state).filter(
    message => message.from === conversation.with || message.to === conversation.with
  );
}
