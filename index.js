const TelegramBot = require('node-telegram-bot-api')
const mongoose = require('mongoose')

const {TelegramToken, mongoURI} = require('./config')

const onCrocodile = require('./crocodile/events/onCrocodile')
const onRating = require('./crocodile/events/onRating')
const onMyRating = require('./crocodile/events/onMyRating')
const onCallbackQuery = require('./crocodile/events/onCallbackQuery')

const botConfig = {
    polling: {
        interval: 300,
        autoStart: true,
        params: { timeout: 10}
    }
}

const start = async () => {
    try {
        const bot = new TelegramBot(TelegramToken, botConfig)

        const me = await bot.getMe()
        bot.nowCrocodiles = new Map()
        

        bot.onText(RegExp(`^\/crocodile(@${me.username})?$`), msg => { onCrocodile(msg,bot) })
        
        bot.onText(RegExp(`^\/rating(@${me.username})?$`), (msg) => { onRating(msg,bot) })

        bot.onText(RegExp(`^\/myrating(@${me.username})?$`), (msg) => { onMyRating(msg,bot) })

        bot.on('callback_query', query => { onCallbackQuery(query,bot) })

        await mongoose.connect(mongoURI, { 
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
    } catch (e) {
        console.log(e)
    }
}

start()
