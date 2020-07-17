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
    if (hrs == 1) {var hrs_string = ' hour '} else {var hrs_string = ' hours '}
    if (mins == 1) {var mins_string = ' minute '} else {var mins_string = ' minutes '}
    if (secs == 1) {var secs_string = ' second '} else {var secs_string = ' seconds '}
	var result = ''
	if ((hrs == 0) && (mins == 0) && (secs == 0)) {result = 'less than a second'}
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
		msg.channel.send('You got the daily reward (100 moneys), the next reward will be available in 24 hours')
	}
	else {
		var time_left = msToTime(eval('daily_cooldown.'+rewarded)-Date.now())
		msg.channel.send('Time left until the daily reward: '+time_left)
	}
}

module.exports.daily = daily