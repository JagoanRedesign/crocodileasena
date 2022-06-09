const {getChatRating} = require('./crocodile/rating')

module.exports = async (msg,bot) => {
    try {
        bot.deleteMessage(msg.chat.id,msg.message_id)
        if (msg.chat.type != 'supergroup')
            {
                bot.sendMessage(msg.chat.id, 'Ошибка! Играть в крокодила можно только в чат-группе')
                return
            }
        const users = await getChatRating(msg.chat.id)
        if (!users) {
            bot.sendMessage(msg.chat.id, '<b>В этом чате еще не было игр </b>🤡', {parse_mode:'HTML'})
            return
        }
        users.sort((a,b) => { return b.wasWin - a.wasWin })
        let message = `<b>Топ игроков в этом чате</b>😎
`

        let i = 0
        for (const user of users) {
            if (i > 25) break
            if (user.wasWin == 0) break
            i++
            const findedUser = (await bot.getChatMember(msg.chat.id,user.userID)).user
            const decorName = findedUser.hasOwnProperty('first_name') ? findedUser.first_name : findedUser.username   
            let now = `
<b>${i}</b>. ${decorName} — ${user.wasWin} ответа(ов)  `
            switch(i) {
                case 1:
                    now = now + '🥇'
                    break;
                case 2:
                    now = now + '🥈'
                    break;
                case 3:
                    now = now + '🥉'
                    break;
            }
            message = message + now
        }
        bot.sendMessage(msg.chat.id, message, {parse_mode:'HTML'})
    } catch (e) {console.log(e)}
}