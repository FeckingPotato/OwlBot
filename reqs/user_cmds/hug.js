module.exports = async function hug(msg, mongo_client) {
	let database = require('../database.js');
	let fs = require('fs');
	let translation = JSON.parse(fs.readFileSync('./reqs/translation.json'));
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
	let hugger = msg.member.user;
	let hugged = msg.mentions.users.first();
	if (!hugged) msg.channel.send(hugger.username + translation[lang].hug_undefined);
	else {
		if (hugger.id === hugged.id)
			msg.channel.send(
				`${hugger.username} ${translation[lang].hug_self}`
			);
		else
			msg.channel.send(
				`${hugger.username} ${translation[lang].hug_someone} ${hugged.username}`
			);
	}
};
