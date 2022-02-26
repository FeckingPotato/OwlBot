module.exports = async function pay(msg, mongo_client) {
	let database = require('../database.js');
	let fs = require('fs');
	let translation = JSON.parse(fs.readFileSync('./reqs/translation.json'));
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
	let payer = await msg.member.user;
	let paid = await msg.mentions.users.first();
	let money = parseInt(await msg.content.split(' ').reverse()[0]);
	if (paid === undefined) msg.channel.send(translation[lang].pay_person);
	else if (money === undefined) msg.channel.send(translation[lang].pay_money);
	else if (money % 1 !== 0 || money < 0) msg.channel.send(translation[lang].pay_integer);
	else {
		let money_payer = await database.getValue(mongo_client, payer.id, 'money');
		if (money_payer < money) msg.reply(translation[lang].notenoughcashstranger);
		else {
			await database.incValue(mongo_client, paid.id, 'money', money);
			await database.incValue(mongo_client, payer.id, 'money', -money);
			msg.reply(`${translation[lang].pay_success}${'`'}${paid.username}${'`'} ₴‎${money}`);
		}
	}
};
