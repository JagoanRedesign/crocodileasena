const {startGame} = require('./crocodile/startGame')

module.exports = (query,bot) => {
    try {
        bot.emit(query.data,query)
        if (query.data.includes('wantedToPlay'))
            {
                const [command,time,lastWinnerId] = query.data.split('_')
                if (Date.now() - time < 5000 && query.from.id != lastWinnerId)
                    bot.answerCallbackQuery(query.id,{
                        text: 'У прошлого победителя есть 5 секунд чтобы стать ведущим!',
                        show_alert: true })
                else
                    {
                        bot.editMessageReplyMarkup({inline_keyboard:[]},{chat_id:query.message.chat.id,message_id:query.message.message_id})
                        startGame(bot,query.message.chat.id, query.from.id,query.from.first_name)
                    }
            }
    } catch (e) {console.log(e)}
}