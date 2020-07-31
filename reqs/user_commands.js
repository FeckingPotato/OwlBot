const {MessageAttachment} = require('discord.js')
const fs = require('fs')
const http = require('./http-functions.js')
const database = require('./database.js')
const ru = JSON.parse(fs.readFileSync('./translations/ru.json'))
const en = JSON.parse(fs.readFileSync('./translations/en.json'))

async function help(msg, mongo_client) {
	var lang = await database.getValue(mongo_client, msg.guild.id, 'language')
	try {
		var command = msg.content.split(' ')[1]
		if (command === undefined) msg.channel.send(eval(`${lang}.help_main`))
		else msg.channel.send(eval(`${lang}.help_${command}`))
	}
	catch (error) {console.log(error)}
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
	var money = await database.getValue(mongo_client, msg.member.user.id, 'money')
	if (money === undefined) {money = 0}
	money = String(money)
	let money_string = ''
	let money_lastnumber = money.split('').reverse()[0]
	if (money_lastnumber == 1) money_string = eval(`${lang}.money_reply2_single`)
	else if (money_lastnumber >= 5 || money_lastnumber == 0) money_string = eval(`${lang}.money_reply2_many`)
	else money_string = eval(`${lang}.money_reply2_24`)
	var response = eval(`${lang}.money_reply1`) + money + money_string
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
	var lang = await database.getValue(mongo_client, msg.guild.id, 'language')
	var roles_arr = await database.getValue(mongo_client, msg.guild.id, 'role_prices')
	if (roles_arr === undefined ^ []) {msg.channel.send(eval(`${lang}.shop_unavailable`))}
	else {
		var list = eval(`${lang}.shop_available`)
		for (i = 0; i < roles_arr.length; i++) {
			var role = await msg.guild.roles.fetch(roles_arr[i].role_id)
			var role_price = await roles_arr[i].role_price
			let money_string = ''
			let money_lastnumber = String(role_price).split('').reverse()[0]
			if (money_lastnumber == 1) money_string = eval(`${lang}.shop_moneys_single`)
			else if (money_lastnumber >= 5 || money_lastnumber == 0) money_string = eval(`${lang}.shop_moneys_many`)
			else money_string = eval(`${lang}.shop_moneys_24`)
			list = list + `${i+1}. ${'`'}${role.name}${'`'} -  ${role_price}`+ money_string
		}
		msg.channel.send(list)
	}
}

async function buy_role(msg, mongo_client) {
	var lang = await database.getValue(mongo_client, msg.guild.id, 'language')
	let msg_array = msg.content.split(' ')
	msg_array.splice(0, 1)
	let role_name = msg_array.join(' ')
	if (role_name === '') {
		msg.reply(eval(`${lang}.buy_undefined`))
		return
	}
	role = msg.guild.roles.cache.find(role => role.name === role_name)
	if (role === undefined) {
		msg.reply(eval(`${lang}.buy_nonexistent1`)+`${'`'}${role_name}${'`'}`+eval(`${lang}.buy_nonexistent2`))
		return
	}
	let has_role = msg.member.roles.cache.find(role => role.name === role_name)
	if (has_role !== undefined) {
		msg.reply(eval(`${lang}.buy_owned`))
		return
	}
	let roles_db = await database.getValue(mongo_client, msg.guild.id, 'role_prices')
	let money = await database.getValue(mongo_client, msg.member.user.id, 'money')
	var i, buyable
	for (i = 0; i < roles_db.length; i++) {
		if ((Object.values(roles_db[i])[0] == role.id)) {
			buyable = true
			if (roles_db[i].role_price <= money) {
				let payment = -roles_db[i].role_price
				try {
					await msg.member.roles.add(role)
					await database.incValue(mongo_client, msg.member.user.id, 'money', payment)
					await msg.channel.send(`${msg.member}`+eval(`${lang}.buy_success`)+`${'`'}${role_name}${'`'}`)
				}
				catch {msg.reply(eval(`${lang}.buy_error`))}
			}
			else msg.reply(eval(`${lang}.notenoughcashstranger`))
		}
	}
	if (buyable === undefined) {
		msg.reply(eval(`${lang}.buy_unavailable`))
	}
}

async function pay(msg, mongo_client) {
	let lang = await database.getValue(mongo_client, msg.guild.id, 'language')
	let payer = await msg.member.user
	let paid = await msg.mentions.users.first()
	let money = parseInt(await msg.content.split(' ')[2])
	if (paid === undefined) msg.channel.send(eval(`${lang}.pay_person`))
	else if (money === undefined) msg.channel.send(eval(`${lang}.pay_money`))
	else if (money % 1 !== 0 || money < 0) msg.channel.send(eval(`${lang}.pay_integer`))
	else {
		let money_payer = await database.getValue(mongo_client, payer, 'money')
		if (money_payer < money) msg.reply(eval(`${lang}.notenoughcashstranger`))
		else {
			await database.incValue(mongo_client, paid.id, 'money', money)
			await database.incValue(mongo_client, payer.id, 'money', -money)
			money = String(money)
			let money_string = ''
			let money_lastnumber = money.split('').reverse()[0]
			if (money_lastnumber == 1) money_string = eval(`${lang}.pay_success2_single`)
			else if (money_lastnumber >= 5 || money_lastnumber == 0) money_string = eval(`${lang}.pay_success2_many`)
			else money_string = eval(`${lang}.pay_success2_24`)
			msg.reply(eval(`${lang}.pay_success1`) + money + money_string + `${'`'}${paid.username}${'`'}`)
		}
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
module.exports.buy_role = buy_role
module.exports.pay = pay