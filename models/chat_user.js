const { Schema, model,Types } = require('mongoose')
const schema = Schema({
    chatID: { type: String, required: true},
    userID: { type: String, required: true},
    wasLeading: {type: Number, required: true},
    wasExplain: {type: Number, required: true},
    wasWin: {type: Number, required: true},
  })
  
  module.exports = model('Chat_user', schema)


// players = { userID, wasLeading, wasExplain, wasWin }