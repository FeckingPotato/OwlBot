module.exports = async function rr(msg, mongo_client) {
	let database = require('../database.js');
	let fs = require('fs');
	let translation = JSON.parse(fs.readFileSync('./reqs/translation.json'));
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
	let ded_role = msg.guild.roles.cache.find((role) => role.name === 'ded');
	let ded_role_member = msg.member.roles.cache.find((role) => role.name === 'ded');
	if (ded_role === undefined) msg.channel.send(translation[lang].rr_undefined);
	else {
		if (ded_role_member) msg.reply(translation[lang].rr_dead);
		else {
			if (Math.floor(Math.random() * 6) == 0) {
				msg.reply(translation[lang].rr_loss);
				msg.member.roles.add(ded_role);
				setTimeout(() => msg.member.roles.remove(ded_role), 120000);
			} else msg.reply(translation[lang].rr_win);
		}
	}
};
