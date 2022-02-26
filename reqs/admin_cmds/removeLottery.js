module.exports = async function removeLottery(msg, mongo_client) {
	let database = require('../database.js');
	let fs = require('fs');
	let translation = JSON.parse(fs.readFileSync('./reqs/translation.json'));
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
	let existing_value = await database.getValue(mongo_client, msg.guild.id, 'lottery');
	if (existing_value !== undefined) {
		await database.deleteDocument(mongo_client, msg.guild.id, 'lottery');
		msg.channel.send(translation[lang].adm_lottery_removed);
	} else {
		msg.channel.send(translation[lang].adm_lottery_nonexistent);
	}
};
