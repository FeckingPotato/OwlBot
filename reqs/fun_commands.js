const {MessageAttachment} = require('discord.js')
const http = require('./http-functions.js')
const fs = require('fs')
const ru = JSON.parse(fs.readFileSync('./translations/ru.json'))
const en = JSON.parse(fs.readFileSync('./translations/en.json'))

async function owl(msg) {
	http.owl()
	const attachment = new MessageAttachment('./owl.jpg')
	msg.channel.send(attachment);
}

async function rr(msg, lang) {
	let ded_role = msg.guild.roles.cache.find(role => role.name === 'ded')
	let ded_role_member = msg.member.roles.cache.find(role => role.name === 'ded')
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

async function prb(msg, lang) {
	if (msg.content === '!prb') {
		msg.reply(eval(`${lang}.prb_nothing`))
	}
	else {
		msg.reply(eval(`${lang}.prb_something`)+Math.floor(Math.random()*100)+'%')
	}
}

async function egg(msg, lang) {
	var egg_count = JSON.parse(fs.readFileSync('./data/egg-count.json'))
			if (msg.mentions.users.first() === undefined) {
					msg.channel.send(msg.member.user.username+eval(`${lang}.egg_undefined`))
			}
			else {
					if (eval('egg_count.u'+msg.mentions.users.first().id) === (NaN||null||undefined)) {
						eval('egg_count.u'+msg.mentions.users.first().id+' = 1')
					}
					else {
						eval('egg_count.u'+msg.mentions.users.first().id+'++')
					}
					var egger = msg.member.user.username
					var egged = msg.mentions.users.first().username
					var eggs = eval('egg_count.u'+msg.mentions.users.first().id)
					if (msg.member.user.id === msg.mentions.users.first().id) {
						msg.channel.send(egger+eval(`${lang}.egg_self`)+egged+': '+eggs)
					}
					else {
						msg.channel.send(egger+eval(`${lang}.egg_someone1`)+egged+eval(`${lang}.egg_someone2`)+egged+': '+eggs)
					}
					fs.writeFileSync('./data/egg-count.json', JSON.stringify(egg_count), 'utf8')
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