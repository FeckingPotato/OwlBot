const database = require('./database.js')

async function lang(msg, mongo_client) {
    switch (msg.content.split(' ')[1]) {
        case 'en':
            database.setValue(mongo_client, msg.guild.id, 'language', 'en')
            msg.channel.send('The language is English now')
            break
       case 'ru':
            database.setValue(mongo_client, msg.guild.id, 'language', 'ru')
            msg.channel.send('The language is Russian now')
            break
    }
}

module.exports.lang = lang