const database = require('./database.js')
const fs = require('fs')
const ru = JSON.parse(fs.readFileSync('./reqs/translation.json')).ru
const en = JSON.parse(fs.readFileSync('./reqs/translation.json')).en

async function lang(msg, mongo_client) {
    switch (msg.content.split(' ')[1]) {
        case 'en':
            database.setValue(mongo_client, msg.channel.id, 'language', 'en')
            msg.channel.send(en.set_lang)
            break
       case 'ru':
            database.setValue(mongo_client, msg.channel.id, 'language', 'ru')
            msg.channel.send(ru.set_lang)
            break
    }
}

async function setPaidRole(msg, mongo_client) { 
    let msg_split = await msg.content.split(' ') 
    if (await msg_split.length != 3) {
        msg.channel.send('The command syntax is incorrect')
    }
    else {
        let role_id = await msg_split[1]
        let role_price = parseInt(msg_split[2])
        if (await msg.guild.roles.fetch(role_id) === null) {
            msg.channel.send('This role does not exist')
        }
        else {
            let roles = await database.getValue(mongo_client, msg.guild.id, 'role_prices')
            if (roles === undefined ^ null) roles = []
            let i, existing_position
            for (i = 0; i < roles.length; i++) {
               if (role_id == roles[i].role_id) {
                   existing_position = i
                }
            }
            if (existing_position === undefined) {
                await roles.push({role_id: role_id, role_price: role_price})
                database.setValue(mongo_client, msg.guild.id, 'role_prices', roles)
            }
            else {
                roles[existing_position].role_price = role_price
                database.setValue(mongo_client, msg.guild.id, 'role_prices', roles)
            }
        }
    }
}

async function getBotServerDate(msg) {
    msg.channel.send(Date())
}

async function createLottery(msg, mongo_client) {
    let channel = msg.guild.channels.cache.get(msg.content.split(' ')[1])
    let time = Number(msg.content.split(' ')[2])
    let existing_value = await database.getValue(mongo_client, msg.guild.id, 'lottery') 
    if (channel === undefined) msg.channel.send('Wrong channel ID')
    else if (time < 0 || time > 23) msg.channel.send('Time should be a number from 0 to 23')
    else if (existing_value !== undefined){
        database.setValue(mongo_client, msg.guild.id, 'lottery', {channel: channel.id, time: time})
        msg.channel.send('Lottery updated')
    }
    else {
        database.setValue(mongo_client, msg.guild.id, 'lottery', {channel: channel.id, time: time})
        msg.channel.send('Lottery created')
    }
}

async function deleteLottery(msg, mongo_client) {
    let existing_value = await database.getValue(mongo_client, msg.guild.id, 'lottery')
    if (existing_value !== undefined){
        await database.deleteDocument(mongo_client, msg.guild.id, 'lottery')
        msg.channel.send('Lottery deleted')
    }
    else {
        msg.channel.send('There is no lottery to delete')
    }
}

module.exports.lang = lang
module.exports.setPaidRole = setPaidRole
module.exports.getBotServerDate = getBotServerDate
module.exports.createLottery = createLottery
module.exports.deleteLottery = deleteLottery