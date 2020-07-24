const database = require('./database.js')
const fs = require('fs')
const ru = JSON.parse(fs.readFileSync('./translations/ru.json'))
const en = JSON.parse(fs.readFileSync('./translations/en.json'))

async function lang(msg, mongo_client) {
    switch (msg.content.split(' ')[1]) {
        case 'en':
            database.setValue(mongo_client, msg.guild.id, 'language', 'en')
            msg.channel.send(en.set_lang)
            break
       case 'ru':
            database.setValue(mongo_client, msg.guild.id, 'language', 'ru')
            msg.channel.send(ru.set_lang)
            break
    }
}

async function setPaidRole(msg, mongo_client) {
    var msg_split = await msg.content.split(' ')
    if (await msg_split.length != 3) {msg.channel.send('The command syntax is incorrect'); throw 'incorrect syntax'}
    var role_id = await msg_split[1]
    var role_price = parseInt(msg_split[2])
    if (await msg.guild.roles.fetch(role_id) === null) {msg.channel.send('This role does not exist'); throw 'incorrect role id'}
    var roles = await database.getValue(mongo_client, msg.guild.id, 'role_prices')
    if (roles === undefined ^ null) {roles = []}
    var i, exists, same_price, existing_position
    try {
       for (i = 0; i < roles.length; i++) {
           if (role_id == roles[i].role_id) {
               exists = true
                if (role_price = roles[i].role_price) {
                    same_price = true
                    existing_position = i
                }
            }
        }
    }
    catch {}
    if (exists !== true) {
        await roles.push({role_id: role_id, role_price: role_price})
        database.setValue(mongo_client, msg.guild.id, 'role_prices', roles)
    }
    else if (same_price === true && existing_position !== undefined) {
        roles[exising_position].role_price = role_price
        database.setValue(mongo_client, msg.guild.id, 'role_prices', roles)
    }
}

module.exports.lang = lang
module.exports.setPaidRole = setPaidRole