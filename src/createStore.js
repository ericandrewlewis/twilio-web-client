import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { conversations, selectedConversation } from './reducers/conversations';
import { messages } from './reducers/messages';

export default function createAppStore() {
  let rootReducer = combineReducers({
    conversations: combineReducers({
      byId: conversations,
      selected: selectedConversation
    }),
    messages: combineReducers({
      byId: messages
    })
  });

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  return createStore(
    rootReducer,
    composeEnhancers(
      applyMiddleware(
        thunk,
        logger
      )
    )
  );
}
