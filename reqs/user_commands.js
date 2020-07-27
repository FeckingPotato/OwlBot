const {MessageAttachment} = require('discord.js')
const fs = require('fs')
const http = require('./http-functions.js')
const database = require('./database.js')
const ru = JSON.parse(fs.readFileSync('./translations/ru.json'))
const en = JSON.parse(fs.readFileSync('./translations/en.json'))

async function help(msg, mongo_client) {
	var lang = await database.getValue(mongo_client, msg.guild.id, 'language')
	switch(msg.content.split(' ')[1]) {
		default:
			msg.channel.send(eval(`${lang}.help_main`)) // this thing throws 'SyntaxError: Unexpected token (' for some reason
			break
		case 'help':
			msg.channel.send(eval(`${lang}.help_help`))
			break
		case 'owl': 
			msg.channel.send(eval(`${lang}.help_owl`))
			break
		case 'prb':
			msg.channel.send(eval(`${lang}.help_prb`))
			break
		case 'egg':
			msg.channel.send(eval(`${lang}.help_egg`))
			break
		case 'rr':
			msg.channel.send(eval(`${lang}.help_rr`))
			break
		case 'daily':
			msg.channel.send(eval(`${lang}.help_daily`))
			break
		case 'money':
			msg.channel.send(eval(`${lang}.help_money`))
			break
	}
}

function owl(msg) {
	const attachment = new MessageAttachment('./owl.jpg')
	msg.channel.send(attachment)
	http.owl()
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

function msToTime(s, lang) {
	var ms = s % 1000
	s = (s - ms) / 1000
	var secs = s % 60
	s = (s - secs) / 60
	var mins = s % 60
	var hrs = (s - mins) / 60
	if (lang == 'ru') {
		var hrs_last_number = hrs.toString().split('').reverse()[0]
		var mins_last_number = mins.toString().split('').reverse()[0]
		var secs_last_number = secs.toString().split('').reverse()[0]
    	if (hrs_last_number == 1) {var hrs_string = ' час '} else if ((hrs_last_number > 1) && (hrs_last_number < 5)) {var hrs_string = ' часа '} else {var hrs_string = ' часов '}
    	if (mins_last_number == 1) {var mins_string = ' минута '} else if ((mins_last_number) > 1 && (mins_last_number < 5)) {var mins_string = ' минуты '} else {var mins_string = ' минут '}
		if (secs_last_number == 1) {var secs_string = ' секунда '} else if ((secs_last_number) > 1 && (secs_last_number < 5)) {var secs_string = ' секунды '} else {var secs_string = ' секунд '}
	}
	else {
		if (hrs == 1) {var hrs_string = ' hour '} else {var hrs_string = ' hours '}
    	if (mins == 1) {var mins_string = ' minute '} else {var mins_string = ' minutes '}
		if (secs == 1) {var secs_string = ' second '} else {var secs_string = ' seconds '}
	}
	var result = ''
	if ((hrs == 0) && (mins == 0) && (secs == 0)) {result = eval(`${lang}.mstotime_less`)}
	if (hrs > 0) {result = result + hrs + hrs_string}
	if (mins > 0) {result = result + mins + mins_string}
	if (secs > 0) {result = result + secs + secs_string}
	return result
}

async function money(msg, mongo_client) {
	var lang = await database.getValue(mongo_client, msg.guild.id, 'language')
	var money_amount = await database.getValue(mongo_client, msg.member.user.id, 'money')
	if (money_amount === undefined) {money_amount = 0}
	var response = eval(`${lang}.money_reply1`)+money_amount+eval(`${lang}.money_reply2`)
	msg.reply(response)
}

async function daily(msg, mongo_client) {
	var lang = await database.getValue(mongo_client, msg.guild.id, 'language')
	var rewarded = msg.member.user.id
	var money = await database.getValue(mongo_client, rewarded, 'money')
	var daily_cooldown = await database.getValue(mongo_client, rewarded, 'daily-cooldown')
	if ((daily_cooldown === undefined) || (daily_cooldown <= Date.now())) {
		var cooldown_exp = Date.now()+86400000
		database.setValue(mongo_client, rewarded, 'daily-cooldown', cooldown_exp)
		if (money === undefined) {database.setValue(mongo_client, rewarded, 'money', 0)}
		database.incValue(mongo_client, rewarded, 'money', 100)
		msg.channel.send(eval(`${lang}.daily_reward`))
	}
	else {
		var time_left = msToTime(await database.getValue(mongo_client, rewarded, 'daily-cooldown')-Date.now(), lang)
		msg.channel.send(eval(`${lang}.daily_left`)+time_left)
	}
}

async function shop(msg, mongo_client) {
	var roles_arr = await database.getValue(mongo_client, msg.guild.id, 'role_prices')
	if (roles_arr === undefined ^ []) {msg.channel.send('There are no roles available for sale')}
	else {
		var list = `List of the available roles:
`
		for (i = 0; i < roles_arr.length; i++) {
			var role = await msg.guild.roles.fetch(roles_arr[i].role_id)
			list = list + `${i+1}. ${'`'}${role.name}${'`'} -  ${await roles_arr[i].role_price} moneys
`
		}
		msg.channel.send(list)
	}
}

module.exports.help = help
module.exports.owl = owl
module.exports.rr = rr
module.exports.prb = prb
module.exports.egg = egg
module.exports.money = money
module.exports.daily = daily
module.exports.shop = shop
