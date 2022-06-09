const { Schema, model,Types } = require('mongoose')
const schema = Schema({
    chatID: { type: String, required: true, unique: true},
    players: [{ type: Types.ObjectId, ref: 'Chat_user' }],
  })
  
  module.exports = model('Chat', schema)


// players = { userID, wasLeading, wasExplain, wasWin }