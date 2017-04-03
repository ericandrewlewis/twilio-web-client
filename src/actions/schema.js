import { schema } from 'normalizr';

export const conversations = new schema.Entity('conversations', {}, { idAttribute: '_id'});
export const arrayOfConversations = new schema.Array(conversations);

export const messages = new schema.Entity('messages', {}, { idAttribute: '_id'});
export const arrayOfMessages = new schema.Array(messages);
