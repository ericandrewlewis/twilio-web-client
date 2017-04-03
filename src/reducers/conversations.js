export function conversations(state = [], action) {
  switch(action.type) {
    case 'RECEIVE_CONVERSATIONS':
      return state = action.conversations;
    default:
      return state;
  }
}

export function selectedConversation(state = '', action) {
  switch(action.type) {
    case 'SET_SELECTED_CONVERSATION':
      return state = action.with;
    default:
      return state;
  }
}

export function getConversationById(state, id) {
  return state.conversations.byId[id];
}

// A selector to get an array of all conversations.
export function getConversations(state) {
  return Object.keys(state.conversations.byId).map((id) => {
    return getConversationById(state, id);
  })
}

export function getSelectedConversationId(state) {
  return state.conversations.selected;
}
