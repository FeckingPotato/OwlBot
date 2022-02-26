module.exports = async function createLottery(msg, mongo_client) {
	let database = require('../database.js');
	let fs = require('fs');
	let translation = JSON.parse(fs.readFileSync('./reqs/translation.json'));
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
	let channel = msg.guild.channels.cache.get(msg.content.split(' ')[1]);
	let time = Number(msg.content.split(' ')[2]);
	let existing_value = await database.getValue(mongo_client, msg.guild.id, 'lottery');
	if (channel === undefined) msg.channel.send(translation[lang].adm_lottery_id);
	else if (time < 0 || time > 23) msg.channel.send(translation[lang].adm_lottery_time);
	else if (existing_value !== undefined) {
		database.setValue(mongo_client, msg.guild.id, 'lottery', {channel: channel.id, time: time});
		msg.channel.send(translation[lang].adm_lottery_updated);
	} else {
		database.setValue(mongo_client, msg.guild.id, 'lottery', {channel: channel.id, time: time});
		msg.channel.send(translation[lang].adm_lottery_created);
	}
};
