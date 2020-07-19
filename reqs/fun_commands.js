const {MessageAttachment} = require('discord.js')
const fs = require('fs')
const http = require('./http-functions.js')
const database = require('./database.js')
const ru = JSON.parse(fs.readFileSync('./translations/ru.json'))
const en = JSON.parse(fs.readFileSync('./translations/en.json'))

async function owl(msg) {
	const attachment = new MessageAttachment(http.owl())
	await msg.channel.send(attachment);
}

async function rr(msg, mongo_client) {
	var lang = await database.getValue(mongo_client, msg.guild.id, 'language')
	var ded_role = msg.guild.roles.cache.find(role => role.name === 'ded')
	var ded_role_member = msg.member.roles.cache.find(role => role.name === 'ded')
	if (ded_role === undefined) {
		msg.channel.send(eval(`${lang}.rr_undefined`))
	}
	else {
		if (ded_role_member) {
			msg.reply(eval(`${lang}.rr_dead`))	
		}
		else {
			if (Math.floor(Math.random()*6) == 0) {
			msg.reply(eval(`${lang}.rr_loss`))
			msg.member.roles.add(ded_role)
			setTimeout(() => msg.member.roles.remove(ded_role), 120000)
			}
			else {
				msg.reply(eval(`${lang}.rr_win`))
			}
		}
	}
}

async function prb(msg, mongo_client) {
	var lang = await database.getValue(mongo_client, msg.guild.id, 'language')
	if (msg.content === '!prb') {
		msg.reply(eval(`${lang}.prb_nothing`))
	}
	else {
		msg.reply(eval(`${lang}.prb_something`)+Math.floor(Math.random()*100)+'%')
	}
}

async function egg(msg, mongo_client) {
	var lang = await database.getValue(mongo_client, msg.guild.id, 'language')
	var egger = msg.member.user
	var egged = msg.mentions.users.first()
	if (egged === undefined) {
		msg.channel.send(msg.member.user.username+eval(`${lang}.egg_undefined`))
	}
	else {
		egg_count = await database.getValue(mongo_client, egged.id, 'egg-count')
		if (egg_count === (NaN||null||undefined)) {
			database.setValue(mongo_client, egged.id, 'egg-count', 1)
			egg_count = 1
		}
		else {
			database.incValue(mongo_client, egged.id, 'egg-count', 1)
			egg_count = egg_count + 1
		}
		if (egger.id === egged.id) {
			msg.channel.send(egger.username+eval(`${lang}.egg_self`)+egged.username+': '+egg_count)
		}
		else {
			msg.channel.send(egger.username+eval(`${lang}.egg_someone1`)+egged.username+eval(`${lang}.egg_someone2`)+egged.username+': '+egg_count)
		}
	}
}

/*async function translate(msg) {
	if (msg.content === '!translate') {
		msg.channel.send('What do you want to translate?')
	}
	else {
		var translate_req = msg.content.split(' ')
		if (translate_req.length > 3){
			var i
			for (i = 3; i < translate_req.length; i++) {
			translate_req[2] = translate_req[2] + ' ' + translate_req[i]
			}
		}
		try {
			msg.channel.send(http.translate(translate_req[2], translate_req[1])+`
Переведено сервисом «Яндекс.Переводчик» (<http://translate.yandex.ru>)`)
			}
		catch (e) {
			if (e === 'lang_err') {
				msg.channel.send('The language pair is incorrect')
				}
		}
	}
}*/

module.exports.owl = owl
module.exports.rr = rr
module.exports.prb = prb
module.exports.egg = egg
//module.exports.translate = translate (yandex translate api became paid, need to change to a free one)