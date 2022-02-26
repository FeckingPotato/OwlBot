module.exports = async function daily(msg, mongo_client) {
	let database = require('../database.js');
	let fs = require('fs');
	let translation = JSON.parse(fs.readFileSync('./reqs/translation.json'));
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
	let rewarded = msg.member.user.id;
	let money = await database.getValue(mongo_client, rewarded, 'money');
	let daily_cooldown = await database.getValue(mongo_client, rewarded, 'daily-cooldown');
	if (daily_cooldown === undefined || daily_cooldown <= Date.now()) {
		let cooldown_exp = Date.now() + 86400000;
		database.setValue(mongo_client, rewarded, 'daily-cooldown', cooldown_exp);
		if (money === undefined) database.setValue(mongo_client, rewarded, 'money', 0);
		database.incValue(mongo_client, rewarded, 'money', 100);
		msg.channel.send(translation[lang].daily_reward);
	} else {
		let time_left = require('../mstotime.js')((await database.getValue(mongo_client, rewarded, 'daily-cooldown')) - Date.now(),lang);
		msg.channel.send(translation[lang].daily_left + time_left);
	}
};
