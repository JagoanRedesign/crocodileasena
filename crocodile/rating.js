const Chat = require('../models/chat')
const Chat_user = require('../models/chat_user')

const addUserStat = async (chatID, userID,stat) => {
    let user = await Chat_user.findOne({chatID,userID})
    if (!user) {

        const obj = {
            userID,
            chatID,
            wasLeading: 0,
            wasExplain: 0,
            wasWin: 0
        }
        obj[stat]++
        user = new Chat_user(obj)
        user.save()
        
        let chat = await Chat.findOne({chatID})
        if (!chat) { //Если чата нет - создать
            chat = new Chat({
                chatID,
                players: [user.id]
            })
        } else
            chat.players.push(user.id)
        await chat.save()
    } else {
        user[stat]++
        await user.save()
    }
}

const getChatRating = async (chatID) => {
    const chat = await Chat.findOne({chatID})
    if (!chat) return undefined
    const answer = []
    for (playerID of chat.players) {
        const player = await Chat_user.findById(playerID)
        answer.push(player) 
    }
    return answer
}

const getUserRating = async (chatID,userID) => {
    const user = await Chat_user.findOne({chatID,userID})
    return user
}

module.exports = {addUserStat,getChatRating,getUserRating}