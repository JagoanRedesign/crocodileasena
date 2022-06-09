const {getRanomWord} = require('./words')
const {addUserStat} = require('./rating')

const startGame = async (bot, chatID, masterID,masterName) => {
    const getRegExp = (word) => {
        const newWord = word.split('').map(item => {
            if (item == 'ё' || item == 'е')
                return '(е|ё)'
            return item
        }).join('')
        return RegExp(`^${newWord}$(${chatID})?`,'i')
    }
    if (bot.nowCrocodiles.has(chatID)) { //если игра в чате уже идет
        const game = bot.nowCrocodiles.get(chatID)
        if (Date.now() - game.startTime < 300*1000) {//прошло ли 5 минут 
            bot.sendMessage(chatID, `Игра в этом чате уже запущена и прошло менее 5 минут`)
            return
        }
        else {
            bot.sendMessage(chatID, `Завершаю старую игру и начинаю новую`)
            bot.removeTextListener(getRegExp(game.word))
            bot.removeListener(`getWord_${chatID}`,)
            bot.removeListener(`changeWord_${chatID}`)
            bot.removeListener(`cancelGame_${chatID}`)
            bot.nowCrocodiles.delete(chatID)
            bot.editMessageReplyMarkup({inline_keyboard:[]},{message_id: game.startMessageId, chat_id: chatID})
        }
    }

    let word = getRanomWord()

    const startMessage = await bot.sendMessage( 
        chatID,
        `[${masterName}](tg://user?id=${masterID}) объясняет слово`, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{text: '📽 Показать слово', callback_data: `getWord_${chatID}`}],
                    [{text: '♻ Поменять слово', callback_data: `changeWord_${chatID}`}],
                    [{text: '⛔ Завершить игру', callback_data: `cancelGame_${chatID}`}],
                ]
             }
        })
    
    console.log(`Game started on chat ${chatID}, at time ${Date.now()}, masterID ${masterID}, master name ${masterName}, word ${word}`)
    
    bot.nowCrocodiles.set(chatID, {
        chatID,
        word,
        startMessageId: startMessage.message_id,
        startTime: Date.now()
    })

    await addUserStat(chatID,masterID,'wasLeading')

    const onGuess = async (msg) => {
        if (chatID != msg.chat.id || msg.from.id == masterID) return

        bot.nowCrocodiles.delete(chatID)
        await bot.sendMessage(
            chatID, 
            `[${msg.from.first_name}](tg://user?id=${msg.from.id}) угадал(а) слово *${word}*!`, {
            parse_mode:'Markdown',
            reply_markup: {
            inline_keyboard: [[{text: '🤓 Хочу быть ведущим!', callback_data: `wantedToPlay_${Date.now()}_${msg.from.id}`}]]}
        })
        bot.removeTextListener(getRegExp(word))
        bot.removeListener(`getWord_${chatID}`,)
        bot.removeListener(`changeWord_${chatID}`)
        bot.removeListener(`cancelGame_${chatID}`)
        bot.editMessageReplyMarkup({inline_keyboard:[]},{message_id: startMessage.message_id, chat_id: chatID})
        await addUserStat(chatID,masterID,'wasExplain')
        await addUserStat(chatID,msg.from.id,'wasWin')
        console.log(`User ${msg.from.id} win on chat ${chatID}, word ${word}`)
    }

    bot.onText(getRegExp(word), onGuess)
    
    bot.on(`getWord_${chatID}`, query => {
        if (query.from.id != masterID) {
            bot.answerCallbackQuery(query.id,{
            text: 'Ошибка! Вы не ведущий',
            show_alert: true })
            return
        }

        bot.answerCallbackQuery(query.id,{ text: word, show_alert: true })
    })

    bot.on(`changeWord_${chatID}`, query => {
        if (query.from.id != masterID) {
            bot.answerCallbackQuery(query.id,{
            text: 'Ошибка! Вы не ведущий',
            show_alert: true })
            return 
        }
        
        bot.removeTextListener(getRegExp(word))
        word = getRanomWord()
        bot.onText(getRegExp(word), onGuess)
        bot.answerCallbackQuery(query.id,{ text: word, show_alert: true })
        console.log(`Word changed on chat ${chatID}, word ${word}, userID ${query.from.id}`)
    })

    bot.on(`cancelGame_${chatID}`, query => {
        if (query.from.id != masterID) {
            bot.answerCallbackQuery(query.id,{
            text: 'Ошибка! Вы не ведущий',
            show_alert: true })
            return
        }

        bot.answerCallbackQuery(query.id,{ show_alert: false })

        bot.nowCrocodiles.delete(chatID)
        bot.sendMessage(chatID, `Игра завершена`)
        bot.removeTextListener(getRegExp(word))
        bot.removeListener(`getWord_${chatID}`,)
        bot.removeListener(`changeWord_${chatID}`)
        bot.removeListener(`cancelGame_${chatID}`)
        bot.editMessageReplyMarkup({inline_keyboard:[]},{message_id: startMessage.message_id, chat_id: chatID})
        console.log(`Game closed on chat ${chatID}, word ${word}`)
    })

}

module.exports = {startGame}