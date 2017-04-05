const express = require('express');
const Conversation = require('./db').Conversation;
const Message = require('./db').Message;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_ACCOUNT_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilio = require('twilio');
const twilioClient = new twilio.RestClient(twilioAccountSid, twilioAuthToken);

const getConversation = (request, response) => {
  Conversation.find().exec().then((conversations) => {
    // Decorate a conversation response with the ID of the last message.
    return Promise.all(
      conversations.map((conversation) => {
        return Message.findOne({
          $or: [
            { from: conversation.with },
            { to: conversation.with }
          ]
        }).exec().then((message) => {
          return Object.assign({}, conversation.toJSON(), { lastMessageId: message._id });
        });
      })
    );
  })
    .then((conversations) => {
      response.json(conversations);
    })
    .catch((error) => {
      response.send(error);
    });
};

const getMessage = (request, response) => {
  let findCondition = {};
  if (request.query.ids) {
    findCondition = {
      _id: { $in: request.query.ids }
    };
  }
  if (request.query.conversationId) {
    findCondition = {
      conversationId: request.query.conversationId
    };
  }
  Message.find(findCondition).exec()
    .then((messages) => {
      response.json(messages);
    })
    .catch((error) => {
      response.send(error);
    });
};

const createMessage = ({io}) => {
  return (request, response) => {
    const {content, to, conversationId} = request.body;
    const message = new Message({
      from: 'self',
      to,
      content,
      conversationId,
      status: 'sending'
    });
    message.save()
      .then((doc) => {
        response.json(doc.toJSON());
        return twilioClient.messages.create({
          body: content,
          to: to,
          from: twilioPhoneNumber
        }).then((twilioMessage) => {
          return {
            doc,
            twilioMessage
          }
        })
      })
      .then(({doc, twilioMessage}) => {
        return Message.update({_id: doc._id}, { status: 'sent' }).exec()
          .then((result) => {
            return doc;
          });
      }).then((message) => {
        io.emit('updateMessage', {id: message.id});
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

const twilioWebhookHandler = ({io}) => {
  return (request, response) => {
    response.send("<Response></Response>");
    const from = request.body.From;
    const content = request.body.Body;
    Conversation.findOne({
      with: from
    }).exec().then((conversation) => {
      const message = new Message({
        from,
        to: 'self',
        content,
        conversationId: conversation.id,
        status: 'sent'
      });
      return message.save();
    }).then((doc) => {
      io.emit('updateMessage', {id: doc.id});
    }).catch((error) => {
      console.error(error);
    });
  };
}

const createRouter = ({io}) => {
  const router = express.Router();
  router.get('/conversation', getConversation);
  router.get('/message', getMessage);
  router.post('/message', createMessage({io}));
  router.post('/twilio-webhook-handler', twilioWebhookHandler({io}));
  return router;
};

module.exports = createRouter;
