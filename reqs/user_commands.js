const {MessageAttachment} = require('discord.js')
const fs = require('fs')
const http = require('./http-functions.js')
const database = require('./database.js')
const ru = JSON.parse(fs.readFileSync('./translations/ru.json'))
const en = JSON.parse(fs.readFileSync('./translations/en.json'))

async function help(msg, mongo_client) {
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language')
	try {
		let command = msg.content.split(' ')[1]
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
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language')
	let ded_role = msg.guild.roles.cache.find(role => role.name === 'ded')
	let ded_role_member = msg.member.roles.cache.find(role => role.name === 'ded')
	if (ded_role === undefined) msg.channel.send(eval(`${lang}.rr_undefined`))
	else {
		if (ded_role_member) msg.reply(eval(`${lang}.rr_dead`))	
		else {
			if (Math.floor(Math.random()*6) == 0) {
			msg.reply(eval(`${lang}.rr_loss`))
			msg.member.roles.add(ded_role)
			setTimeout(() => msg.member.roles.remove(ded_role), 120000)
			}
			else msg.reply(eval(`${lang}.rr_win`))
		}
	}
}

async function prb(msg, mongo_client) {
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language')
	if (msg.content === '!prb') msg.reply(eval(`${lang}.prb_nothing`))
	else msg.reply(eval(`${lang}.prb_something`)+Math.floor(Math.random()*100)+'%')
}

async function egg(msg, mongo_client) {
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language')
	let egger = msg.member.user
	let egged = msg.mentions.users.first()
	if (egged === undefined) msg.channel.send(msg.member.user.username+eval(`${lang}.egg_undefined`))
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
		if (egger.id === egged.id) msg.channel.send(egger.username+eval(`${lang}.egg_self`)+egged.username+': '+egg_count)
		else msg.channel.send(egger.username+eval(`${lang}.egg_someone1`)+egged.username+eval(`${lang}.egg_someone2`)+egged.username+': '+egg_count)
	}
}

function msToTime(s, lang) {
	let ms = s % 1000
	s = (s - ms) / 1000
	let secs = s % 60
	s = (s - secs) / 60
	let mins = s % 60
	let hrs = (s - mins) / 60
	if (lang == 'ru') {
		let hrs_last_number = hrs.toString().split('').reverse()[0]
		let mins_last_number = mins.toString().split('').reverse()[0]
		let secs_last_number = secs.toString().split('').reverse()[0]
    	if (hrs_last_number == 1) {var hrs_string = ' час '} else if ((hrs_last_number > 1) && (hrs_last_number < 5)) {var hrs_string = ' часа '} else {var hrs_string = ' часов '}
    	if (mins_last_number == 1) {var mins_string = ' минута '} else if ((mins_last_number) > 1 && (mins_last_number < 5)) {var mins_string = ' минуты '} else {var mins_string = ' минут '}
		if (secs_last_number == 1) {var secs_string = ' секунда '} else if ((secs_last_number) > 1 && (secs_last_number < 5)) {var secs_string = ' секунды '} else {var secs_string = ' секунд '}
	}
	else {
		if (hrs == 1) {var hrs_string = ' hour '} else {var hrs_string = ' hours '}
    	if (mins == 1) {var mins_string = ' minute '} else {var mins_string = ' minutes '}
		if (secs == 1) {var secs_string = ' second '} else {var secs_string = ' seconds '}
	}
	let result = ''
	if ((hrs == 0) && (mins == 0) && (secs == 0)) {result = eval(`${lang}.mstotime_less`)}
	if (hrs > 0) {result = result + hrs + hrs_string}
	if (mins > 0) {result = result + mins + mins_string}
	if (secs > 0) {result = result + secs + secs_string}
	return result
}

async function money(msg, mongo_client) {
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language')
	let money = await database.getValue(mongo_client, msg.member.user.id, 'money')
	if (money === undefined) {money = 0}
	let response = eval(`${lang}.money_reply`) + money
	msg.reply(response)
}

async function daily(msg, mongo_client) {
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language')
	let rewarded = msg.member.user.id
	let money = await database.getValue(mongo_client, rewarded, 'money')
	let daily_cooldown = await database.getValue(mongo_client, rewarded, 'daily-cooldown')
	if ((daily_cooldown === undefined) || (daily_cooldown <= Date.now())) {
		let cooldown_exp = Date.now()+86400000
		database.setValue(mongo_client, rewarded, 'daily-cooldown', cooldown_exp)
		if (money === undefined) database.setValue(mongo_client, rewarded, 'money', 0)
		database.incValue(mongo_client, rewarded, 'money', 100)
		msg.channel.send(eval(`${lang}.daily_reward`))
	}
	else {
		let time_left = msToTime(await database.getValue(mongo_client, rewarded, 'daily-cooldown')-Date.now(), lang)
		msg.channel.send(eval(`${lang}.daily_left`)+time_left)
	}
}

async function shop(msg, mongo_client) {
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language')
	let roles_arr = await database.getValue(mongo_client, msg.guild.id, 'role_prices')
	if (roles_arr === undefined ^ []) msg.channel.send(eval(`${lang}.shop_unavailable`))
	else {
		let list = eval(`${lang}.shop_available`)
		for (i = 0; i < roles_arr.length; i++) {
			let role = await msg.guild.roles.fetch(roles_arr[i].role_id)
			let role_price = await roles_arr[i].role_price
			list = list + `${i+1}. ${'`'}${role.name}${'`'} -  ‎₴‎${role_price}\n`
		}
		msg.channel.send(list)
	}
}

async function buy_role(msg, mongo_client) {
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language')
	let msg_array = msg.content.split(' ')
	msg_array.splice(0, 1)
	let role_name = msg_array.join(' ')
	if (role_name === '') msg.reply(eval(`${lang}.buy_undefined`))
	else {
		role = msg.guild.roles.cache.find(role => role.name === role_name)
		if (role === undefined) msg.reply(eval(`${lang}.buy_nonexistent1`)+`${'`'}${role_name}${'`'}`+eval(`${lang}.buy_nonexistent2`))
		else {
			let has_role = msg.member.roles.cache.find(role => role.name === role_name)
			if (has_role !== undefined) msg.reply(eval(`${lang}.buy_owned`))
			else {
				let roles_db = await database.getValue(mongo_client, msg.guild.id, 'role_prices')
				let money = await database.getValue(mongo_client, msg.member.user.id, 'money')
				let i, buyable
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
				if (buyable === undefined) msg.reply(eval(`${lang}.buy_unavailable`))
			}
		}
	}
}

async function pay(msg, mongo_client) {
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language')
	let payer = await msg.member.user
	let paid = await msg.mentions.users.first()
	let money = parseInt(await msg.content.split(' ').reverse()[0])
	if (paid === undefined) msg.channel.send(eval(`${lang}.pay_person`))
	else if (money === undefined) msg.channel.send(eval(`${lang}.pay_money`))
	else if (money % 1 !== 0 || money < 0) msg.channel.send(eval(`${lang}.pay_integer`))
	else {
		let money_payer = await database.getValue(mongo_client, payer.id, 'money')
		if (money_payer < money) msg.reply(eval(`${lang}.notenoughcashstranger`))
		else {
			await database.incValue(mongo_client, paid.id, 'money', money)
			await database.incValue(mongo_client, payer.id, 'money', -money)
			msg.reply(`${eval(`${lang}.pay_success`)}${'`'}${paid.username}${'`'} ₴‎${money}`)
		}
	}
}

async function top (msg, mongo_client) {
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language')
	let money_count = await mongo_client.db(process.env.DB).collection('money').countDocuments()
	let documents = await database.getDocuments(mongo_client, 'money')
	let money_obj = []
	for(var i = 0; i < money_count; i++) {
		let document = documents[i]
		let GuildMember = await msg.guild.members.cache.get(document.id)
		if (GuildMember !== undefined) {
			money_obj.push({'money': document.value, 'name': GuildMember.user.username})
		}
	}
	money_obj.sort(function(a, b){
		let moneyA = a.money
		let moneyB = b.money
		if (moneyA < moneyB) return 1
		if (moneyA > moneyB) return -1
		return 0
	})
	let people_count = 5
	if (money_obj.length < 5) people_count = money_obj.length
	if (people_count == 0) msg.channel.send(eval(`${lang}.top_communism`))
	else if (people_count == 1) msg.channel.send(`${eval(`${lang}.top_oneperson`)} ${money_obj[0].name} - ₴${money_obj[0].money}`)
	else {
		let result = `${eval(`${lang}.top_people1`)} ${people_count} ${eval(`${lang}.top_people2`)}`
		for (var i = 0; i < people_count; i++) {
			result = result + `${i+1}. ${money_obj[i].name} - ₴${money_obj[i].money}\n`
		}
		msg.channel.send(result)
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
module.exports.top = top