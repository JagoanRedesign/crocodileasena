
module.exports = async (msg,bot) => {
    try {
        bot.deleteMessage(msg.chat.id,msg.message_id)
        if (msg.chat.type != 'supergroup')
            {
                bot.sendMessage(msg.chat.id, 'Ошибка! Играть в крокодила можно только в чат-группе')
                return
            }
        const user = await getUserRating(msg.chat.id,msg.from.id)
        if (!user) {
            bot.sendMessage(msg.chat.id, '<b>В этом чате у тебя еще нет статистики </b>⚔', {parse_mode:'HTML'})
            return
        }
        const findedUser = (await bot.getChatMember(msg.chat.id,user.userID)).user
        const decorName = findedUser.hasOwnProperty('first_name') ? findedUser.first_name : findedUser.username
        const message = `<b>Статистика игрока ${decorName}</b>🌌

Был ведущим: ${user.wasLeading}
Успешно объяснил: ${user.wasExplain}
Отгадал: ${user.wasWin}
`
        bot.sendMessage(msg.chat.id, message, {parse_mode:'HTML'})
    } catch (e) {console.log(e)}
}
