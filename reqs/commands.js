const {Discord, Client, MessageAttachment, Guild} = require('discord.js')
const client = new Client()
const guild = new Guild(client)
const http = require('./http-functions.js')
const fs = require('fs')

function owl(msg) {
	http.owl()
	const attachment = new MessageAttachment('./owl.jpg'); 
	msg.channel.send(attachment); 
}

async function rr(msg) {
	let ded_role = msg.guild.roles.cache.find(role => role.name === 'ded')
	let ded_role_member = msg.member.roles.cache.find(role => role.name === 'ded')
	if (ded_role === undefined) {
		msg.channel.send('Создайте роль "ded", чтобы было возможно играть в русскую рулетку')
	}
	else {
		if (ded_role_member) {
			msg.reply('Мёртвые не могут играть в русскую рулетку')	
		}
		else {
				if (Math.floor(Math.random()*6) == 0) {
				msg.reply('ты умер, возродишься через 2 минуты')
				msg.member.roles.add(ded_role)
				setTimeout(() => msg.member.roles.remove(ded_role), 120000)
			}
			else {
				msg.reply('ты выжил')
			}
		}
	}
}

async function prb(msg) {
	if (msg.content === '!prb') {
		msg.reply('Вероятность ничего - 0%')
	}
	else {
		msg.reply('Вероятность этого - '+Math.floor(Math.random()*100)+'%')
	}
}

async function egg(msg) {
	const data = JSON.parse(fs.readFileSync('data.json'))
			if (msg.mentions.users.first() === undefined) {
					msg.channel.send(msg.member.user.username+' съел сырое яйцо')
			}
			else {
					var egg_count = data.egg_count
					if (eval('data.egg_count.u'+msg.mentions.users.first().id) === (NaN||null||undefined)) {
						eval('data.egg_count.u'+msg.mentions.users.first().id+' = 1')
					}
					else {
						eval('data.egg_count.u'+msg.mentions.users.first().id+'++')
					}
					var egger = msg.member.user.username
					var egged = msg.mentions.users.first().username
					var eggs = eval('egg_count.u'+msg.mentions.users.first().id)
					console.log(eggs)
					if (msg.member.user.id === msg.mentions.users.first().id) {
						msg.channel.send(egger+' кинул яйцо в самого себя, всего яиц кинуто в '+egged+': '+eggs)
					}
					else {
						msg.channel.send(egger+' кинул яйцо в '+egged+', всего яиц кинуто в '+egged+': '+eggs)
					}
					fs.writeFileSync('data.json', JSON.stringify(data), 'utf8', console.log('written'))
			}
}

async function translate(msg) {
	if (msg.content === '!translate') {
		msg.channel.send('А что переводить?')
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
				msg.channel.send('Направление перевода введено неправильно')
				}
		}
	}
}

module.exports.owl = owl
module.exports.rr = rr
module.exports.prb = prb
module.exports.egg = egg
module.exports.translate = translate
module.exports.duel = duel