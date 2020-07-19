const fs = require('fs')
const database = require('./database.js')
const ru = JSON.parse(fs.readFileSync('./translations/ru.json'))
const en = JSON.parse(fs.readFileSync('./translations/en.json'))

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

module.exports.money = money
module.exports.daily = daily