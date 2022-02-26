module.exports = async function setPaidRole(msg, mongo_client) {
	let database = require('../database.js');
	let fs = require('fs');
	let translation = JSON.parse(fs.readFileSync('./reqs/translation.json'));
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
	let msg_split = await msg.content.split(' ');
	if ((await msg_split.length) != 3) {
		msg.channel.send(translation[lang].adm_setrole_syntax);
	} else {
		let role_id = await msg_split[1];
		let role_price = parseInt(msg_split[2]);
		if ((await msg.guild.roles.fetch(role_id)) === null) {
			msg.channel.send(translation[lang].adm_setrole_nonexistent);
		} else {
			let roles = await database.getValue(mongo_client, msg.guild.id, 'role_prices');
			if (roles === (undefined ^ null)) roles = [];
			let i, existing_position;
			for (i = 0; i < roles.length; i++) {
				if (role_id == roles[i].role_id) {
					existing_position = i;
				}
			}
			if (existing_position === undefined) {
				await roles.push({role_id: role_id, role_price: role_price});
				database.setValue(mongo_client, msg.guild.id, 'role_prices', roles);
				msg.channel.send(translation[lang].adm_setrole_added);
			} else {
				roles[existing_position].role_price = role_price;
				database.setValue(mongo_client, msg.guild.id, 'role_prices', roles);
				msg.channel.send(translation[lang].adm_setrole_updated);
			}
		}
	}
};
