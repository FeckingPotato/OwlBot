const database = require('./database.js')
const fs = require('fs')
const translation = JSON.parse(fs.readFileSync('./reqs/translation.json'))

async function lang(msg, mongo_client) {
    switch (msg.content.split(' ')[1]) {
        case 'en':
            database.setValue(mongo_client, msg.channel.id, 'language', 'en')
            msg.channel.send(translation.en.adm_setlang)
            break
       case 'ru':
            database.setValue(mongo_client, msg.channel.id, 'language', 'ru')
            msg.channel.send(translation.ru.adm_setlang)
            break
    }
}

async function setPaidRole(msg, mongo_client) { 
    let lang = await database.getValue(mongo_client, msg.channel.id, 'language')
    let msg_split = await msg.content.split(' ') 
    if (await msg_split.length != 3) {
        msg.channel.send(translation[lang].adm_setrole_syntax)
    }
    else {
        let role_id = await msg_split[1]
        let role_price = parseInt(msg_split[2])
        if (await msg.guild.roles.fetch(role_id) === null) {
            msg.channel.send(translation[lang].adm_setrole_nonexistent)
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
                msg.channel.send(translation[lang].adm_setrole_added)
            }
            else {
                roles[existing_position].role_price = role_price
                database.setValue(mongo_client, msg.guild.id, 'role_prices', roles)
                msg.channel.send(translation[lang].adm_setrole_updated)
            }
        }
    }
}

async function getBotServerDate(msg) {
    msg.channel.send(Date())
}

async function createLottery(msg, mongo_client) {
    let lang = await database.getValue(mongo_client, msg.channel.id, 'language')
    let channel = msg.guild.channels.cache.get(msg.content.split(' ')[1])
    let time = Number(msg.content.split(' ')[2])
    let existing_value = await database.getValue(mongo_client, msg.guild.id, 'lottery') 
    if (channel === undefined) msg.channel.send(translation[lang].adm_lottery_id)
    else if (time < 0 || time > 23) msg.channel.send(translation[lang].adm_lottery_time)
    else if (existing_value !== undefined){
        database.setValue(mongo_client, msg.guild.id, 'lottery', {channel: channel.id, time: time})
        msg.channel.send(translation[lang].adm_lottery_updated)
    }
    else {
        database.setValue(mongo_client, msg.guild.id, 'lottery', {channel: channel.id, time: time})
        msg.channel.send(translation[lang].adm_lottery_created)
    }
}

async function deleteLottery(msg, mongo_client) {
    let lang = await database.getValue(mongo_client, msg.channel.id, 'language')
    let existing_value = await database.getValue(mongo_client, msg.guild.id, 'lottery')
    if (existing_value !== undefined){
        await database.deleteDocument(mongo_client, msg.guild.id, 'lottery')
        msg.channel.send(translation[lang].adm_lottery_deleted)
    }
    else {
        msg.channel.send(translation[lang].adm_lottery_nonexistent)
    }
}

module.exports.lang = lang
module.exports.setPaidRole = setPaidRole
module.exports.getBotServerDate = getBotServerDate
module.exports.createLottery = createLottery
module.exports.deleteLottery = deleteLottery