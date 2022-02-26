module.exports = async function buy_role(msg, mongo_client) {
	let database = require('../database.js');
	let fs = require('fs');
	let translation = JSON.parse(fs.readFileSync('./reqs/translation.json'));
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
	let msg_array = msg.content.split(' ');
	msg_array.splice(0, 1);
	let role_name = msg_array.join(' ');
	if (role_name === '') msg.reply(translation[lang].buy_undefined);
	else {
		role = msg.guild.roles.cache.find((role) => role.name === role_name);
		if (role === undefined)
			msg.reply(
				translation[lang].buy_nonexistent1 +
					`${'`'}${role_name}${'`'}` +
					translation[lang].buy_nonexistent2
			);
		else {
			let has_role = msg.member.roles.cache.find((role) => role.name === role_name);
			if (has_role !== undefined) msg.reply(translation[lang].buy_owned);
			else {
				let roles_db = await database.getValue(mongo_client, msg.guild.id, 'role_prices');
				let money = await database.getValue(mongo_client, msg.member.user.id, 'money');
				let i, buyable;
				for (i = 0; i < roles_db.length; i++) {
					if (Object.values(roles_db[i])[0] == role.id) {
						buyable = true;
						if (roles_db[i].role_price <= money) {
							let payment = -roles_db[i].role_price;
							try {
								await msg.member.roles.add(role);
								await database.incValue(mongo_client, msg.member.user.id, 'money', payment);
								await msg.channel.send(
									`${msg.member}` + translation[lang].buy_success + `${'`'}${role_name}${'`'}`
								);
							} catch {
								msg.reply(translation[lang].buy_error);
							}
						} else msg.reply(translation[lang].notenoughcashstranger);
					}
				}
				if (buyable === undefined) msg.reply(translation[lang].buy_unavailable);
			}
		}
	}
};
