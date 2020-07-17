const {Discord, Client, MessageAttachment, Guild} = require('discord.js')
const client = new Client()
const guild = new Guild(client)
const http = require('./http-functions.js')
const fs = require('fs')

async function owl(msg) {
	http.owl()
	const attachment = new MessageAttachment('./owl.jpg'); 
	msg.channel.send(attachment); 
}

async function rr(msg) {
	let ded_role = msg.guild.roles.cache.find(role => role.name === 'ded')
	let ded_role_member = msg.member.roles.cache.find(role => role.name === 'ded')
	if (ded_role === undefined) {
		msg.channel.send('Create a role called "ded" to be able to play Russian roulette')
	}
	else {
		if (ded_role_member) {
			msg.reply('Dead people can not play Russian roulette')	
		}
		else {
				if (Math.floor(Math.random()*6) == 0) {
				msg.reply('you are dead, the revival will happen in 2 minutes')
				msg.member.roles.add(ded_role)
				setTimeout(() => msg.member.roles.remove(ded_role), 120000)
			}
			else {
				msg.reply('you survived')
			}
		}
	}
}

async function prb(msg) {
	if (msg.content === '!prb') {
		msg.reply('probability of nothing is 0%')
	}
	else {
		msg.reply('probability of that is '+Math.floor(Math.random()*100)+'%')
	}
}

async function egg(msg) {
	var egg_count = JSON.parse(fs.readFileSync('./data/egg-count.json'))
			if (msg.mentions.users.first() === undefined) {
					msg.channel.send(msg.member.user.username+' ate a raw egg')
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
						msg.channel.send(egger+' threw an agg at themselves, eggs thrown at '+egged+': '+eggs)
					}
					else {
						msg.channel.send(egger+' threw an egg at '+egged+', eggs thrown at '+egged+': '+eggs)
					}
					fs.writeFileSync('./data/egg-count.json', JSON.stringify(egg_count), 'utf8')
			}
}

async function translate(msg) {
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
			msg.channel.send(http.translate(translate_req[2], translate_req[1])/*+`
Переведено сервисом «Яндекс.Переводчик» (<http://translate.yandex.ru>)`*/)
			}
		catch (e) {
			if (e === 'lang_err') {
				msg.channel.send('The language pair is incorrect')
				}
		}
	}
}

module.exports.owl = owl
module.exports.rr = rr
module.exports.prb = prb
module.exports.egg = egg
module.exports.translate = translate