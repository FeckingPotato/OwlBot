module.exports = async function top(msg, mongo_client) {
	let database = require('../database.js');
	let fs = require('fs');
	let translation = JSON.parse(fs.readFileSync('./reqs/translation.json'));
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
	let money_count = await mongo_client.db(process.env.DB).collection('money').countDocuments();
	let documents = await database.getDocuments(mongo_client, 'money');
	let money_obj = [];
	for (var i = 0; i < money_count; i++) {
		let document = documents[i];
		let GuildMember = await msg.guild.members.cache.get(document.id);
		if (GuildMember !== undefined) {
			money_obj.push({money: document.value, name: GuildMember.user.username});
		}
	}
	money_obj.sort(function (a, b) {
		let moneyA = a.money;
		let moneyB = b.money;
		if (moneyA < moneyB) return 1;
		if (moneyA > moneyB) return -1;
		return 0;
	});
	let people_count = 5;
	if (money_obj.length < 5) people_count = money_obj.length;
	if (people_count == 0) msg.channel.send(translation[lang].top_communism);
	else if (people_count == 1)
		msg.channel.send(
			`${translation[lang].top_oneperson} ${money_obj[0].name} - ₴${money_obj[0].money}`
		);
	else {
		let result = `${translation[lang].top_people1} ${people_count} ${translation[lang].top_people2}`;
		for (var i = 0; i < people_count; i++) {
			result = result + `${i + 1}. ${money_obj[i].name} - ₴${money_obj[i].money}\n`;
		}
		msg.channel.send(result);
	}
};
