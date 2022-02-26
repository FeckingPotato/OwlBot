module.exports = async function money(msg, mongo_client) {
	let database = require('../database.js');
	let fs = require('fs');
	let translation = JSON.parse(fs.readFileSync('./reqs/translation.json'));
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
	let money = await database.getValue(mongo_client, msg.member.user.id, 'money');
	if (money === undefined) {
		money = 0;
	}
	let response = translation[lang].money_reply + money;
	msg.reply(response);
};
