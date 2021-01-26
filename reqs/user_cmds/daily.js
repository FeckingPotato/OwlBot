module.exports = async function daily(msg, mongo_client, database, translation) {
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
	let rewarded = msg.member.user.id;
	let money = await database.getValue(mongo_client, rewarded, 'money');
	let daily_cooldown = await database.getValue(mongo_client, rewarded, 'daily-cooldown');
	if (!daily_cooldown || daily_cooldown <= Date.now()) {
		if ((Date.now() - daily_cooldown) > 86400000) database.setValue(mongo_client, rewarded, 'daily-tier', 0);
		let cooldown_exp = Date.now() + 86400000;
		database.setValue(mongo_client, rewarded, 'daily-cooldown', cooldown_exp);
		let daily_tier = await database.getValue(mongo_client, rewarded, 'daily-tier');
		let reward = 100;
		if (!money) {
			database.setValue(mongo_client, rewarded, 'money', 0);
			money = 0;
		}
		switch(daily_tier) {
			default:
				database.setValue(mongo_client, rewarded, 'daily-tier', 1);
				break;
			case 1:
				reward = 150;
				database.incValue(mongo_client, rewarded, 'daily-tier', 1);
				break;
			case 2:
				reward = 200;
				database.incValue(mongo_client, rewarded, 'daily-tier', 1);
				break;
			case 3:
				reward = 250;
				database.incValue(mongo_client, rewarded, 'daily-tier', 1);
				break;
			case 4:
				reward = 300;
				database.incValue(mongo_client, rewarded, 'daily-tier', 1);
				break;
			case 5:
				reward = 350;
				break;
		};
		database.incValue(mongo_client, rewarded, 'money', reward).then(
			() => msg.channel.send(`${translation[lang].daily_reward1} (‎₴${String(reward)}), ${translation[lang].daily_reward2}: ₴${String(money + reward)}`)
		);
	} else {
		let time_left = require('../mstotime.js')((await database.getValue(mongo_client, rewarded, 'daily-cooldown')) - Date.now(), lang);
		msg.channel.send(`${translation[lang].daily_left}: ${time_left}`);
	}
};
