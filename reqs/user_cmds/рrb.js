module.exports = async function рrb(msg, mongo_client) { //fake
	if (msg.member.hasPermission('ADMINISTRATOR')) {
		let database = require('../database.js');
		let fs = require('fs');
		let translation = JSON.parse(fs.readFileSync('./reqs/translation.json'));
		let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
		if (msg.content === '!prb') msg.reply(translation[lang].prb_nothing);
		else
			msg.reply(
				translation[lang].prb_something + Math.floor(Math.random() * (100 - 80) + 80) + '%'
			);
	}
};
