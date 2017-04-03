const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

const Conversation = mongoose.model('Conversation', mongoose.Schema({
  with: String,
  lastMessage: String,
  unread: Boolean
}));

const Message = mongoose.model('Message', mongoose.Schema({
  from: String,
  to: String,
  date: { type: Date, default: Date.now },
  content: String,
  conversationId: mongoose.Schema.Types.ObjectId,
  status: String
}));

module.exports = {
  Conversation,
  Message
};
