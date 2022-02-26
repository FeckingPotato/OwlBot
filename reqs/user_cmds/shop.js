module.exports = async function shop(msg, mongo_client) {
	let database = require('../database.js');
	let fs = require('fs');
	let translation = JSON.parse(fs.readFileSync('./reqs/translation.json'));
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
	let roles_arr = await database.getValue(mongo_client, msg.guild.id, 'role_prices');
	if (roles_arr === (undefined ^ [])) msg.channel.send(translation[lang].shop_unavailable);
	else {
		let list = translation[lang].shop_available;
		for (i = 0; i < roles_arr.length; i++) {
			let role = await msg.guild.roles.fetch(roles_arr[i].role_id);
			let role_price = await roles_arr[i].role_price;
			list = list + `${i + 1}. ${'`'}${role.name}${'`'} -  ‎₴‎${role_price}\n`;
		}
		msg.channel.send(list);
	}
};
