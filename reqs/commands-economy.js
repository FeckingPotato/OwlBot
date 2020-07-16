const {Discord, Client, MessageAttachment, Guild} = require('discord.js')
const client = new Client()
const guild = new Guild(client)
const http = require('./http-functions.js')
const fs = require('fs')

function msToTime(s) {
	var ms = s % 1000
	s = (s - ms) / 1000
	var secs = s % 60
	s = (s - secs) / 60
	var mins = s % 60
	var hrs = (s - mins) / 60

	return hrs + ' часа ' + mins + ' минут ' + secs + ' секунд'
}

function daily(msg) {
	var rewarded = 'u'+msg.member.user.id
	var money = JSON.parse(fs.readFileSync('money.json'))
	var data = JSON.parse(fs.readFileSync('data.json'))
	if ((eval('data.daily_cooldown.'+rewarded) === undefined) || (eval('data.daily_cooldown.'+rewarded) <= Date.now())) {
		var cooldown_exp = Date.now()+86400000
		eval('data.daily_cooldown.'+rewarded+'='+cooldown_exp)
		fs.writeFileSync('data.json', JSON.stringify(data), 'UTF-8')
		if (eval('money.'+rewarded) === undefined) {eval('money.'+rewarded+'=0')}
		eval('money.'+rewarded+'=money.'+rewarded+'+100')
		fs.writeFileSync('money.json', JSON.stringify(money), 'UTF-8')
		msg.channel.send('Награда получена (100 денег), следующая награда будет доступна через 24 часа')
	}
	else {
		var time_left = msToTime(eval('data.daily_cooldown.'+rewarded)-Date.now())
		msg.channel.send('Времени до награды осталось: '+time_left)
	}
}

module.exports.daily = daily