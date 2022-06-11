const {startGame} = require('./crocodile_tg/crocodile/startGame')

module.exports = (msg,bot) => {
    try {
        bot.deleteMessage(msg.chat.id,msg.message_id)
        if (msg.chat.type != 'supergroup')
            {
                bot.sendMessage(msg.chat.id, 'Ошибка! Играть в крокодила можно только в чат-группе')
                return
            }
        startGame(bot,msg.chat.id,msg.from.id,msg.from.first_name)
    } catch(e) {console.log(e)}
}
