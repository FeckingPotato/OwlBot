const {Discord, Client, MessageAttachment, Guild} = require('discord.js')
const client = new Client()
const guild = new Guild(client)
const fs = require('fs')

function msToTime(s) {
	var ms = s % 1000
	s = (s - ms) / 1000
	var secs = s % 60
	s = (s - secs) / 60
	var mins = s % 60
	var hrs = (s - mins) / 60
	var hrs_last_number = hrs.toString().split('').reverse()[0]
	var mins_last_number = mins.toString().split('').reverse()[0]
	var secs_last_number = secs.toString().split('').reverse()[0]
	if (hrs_last_number == 1) {var hrs_string = ' час '} else if ((hrs_last_number > 1) && (hrs_last_number < 5)) {var hrs_string = ' часа '} else {var hrs_string = ' часов '}
    if (mins_last_number == 1) {var mins_string = ' минута '} else if ((mins_last_number) > 1 && (mins_last_number < 5)) {var mins_string = ' минуты '} else {var mins_string = ' минут '}
	if (secs_last_number == 1) {var secs_string = ' секунда '} else if ((secs_last_number) > 1 && (secs_last_number < 5)) {var secs_string = ' секунды '} else {var secs_string = ' секунд '}
	var result = ''
	var result = ''
	if ((hrs == 0) && (mins == 0) && (secs == 0)) {result = 'меньше секунды'}
	if (hrs > 0) {result = result + hrs + hrs_string}
	if (mins > 0) {result = result + mins + mins_string}
	if (secs > 0) {result = result + secs + secs_string}
	return result
}

function daily(msg) {
	var rewarded = 'u'+msg.member.user.id
	var money = JSON.parse(fs.readFileSync('./data/money.json'))
	var daily_cooldown = JSON.parse(fs.readFileSync('./data/daily-cooldown.json'))
	if ((eval('daily_cooldown.'+rewarded) === undefined) || (eval('daily_cooldown.'+rewarded) <= Date.now())) {
		var cooldown_exp = Date.now()+86400000
		eval('daily_cooldown.'+rewarded+'='+cooldown_exp)
		fs.writeFileSync('./data/daily-cooldown.json', JSON.stringify(daily_cooldown), 'UTF-8')
		if (eval('money.'+rewarded) === undefined) {eval('money.'+rewarded+'=0')}
		eval('money.'+rewarded+'=money.'+rewarded+'+100')
		fs.writeFileSync('./data/money.json', JSON.stringify(money), 'UTF-8')
		msg.channel.send('Награда получена (100 денег), следующая награда будет доступна через 24 часа')
	}
	else {
		var time_left = msToTime(eval('daily_cooldown.'+rewarded)-Date.now())
		msg.channel.send('Времени до награды осталось: '+time_left)
	}
}

module.exports.daily = daily