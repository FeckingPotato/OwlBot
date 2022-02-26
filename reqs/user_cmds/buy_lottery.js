module.exports = async function buy_lottery(msg, mongo_client) {
	let database = require('../database.js');
	let fs = require('fs');
	let translation = JSON.parse(fs.readFileSync('./reqs/translation.json'));
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
	let lottery = await database.getValue(mongo_client, msg.guild.id, 'lottery');
	if (lottery === undefined) msg.channel.send('The lottery is not set up on this server yet');
	else {
		let lottery_tickets = await database.getValue(mongo_client, msg.guild.id, 'lottery_tickets');
		if (lottery_tickets === undefined) lottery_tickets = [];
		for (let i = 0; i < lottery_tickets.length; i++) {
			if (lottery_tickets[i].user === msg.member.user.id) {
				msg.reply(
					`${translation[lang].lottery_exists}${lottery_tickets[i].numbers[0]}, ${lottery_tickets[i].numbers[1]}, ${lottery_tickets[i].numbers[2]}, ${lottery_tickets[i].numbers[3]}, ${lottery_tickets[i].numbers[4]}, ${lottery_tickets[i].numbers[5]}`
				);
				return;
			}
		}
		let money = await database.getValue(mongo_client, msg.member.user.id, 'money');
		if (money < 50) msg.reply(translation[lang].notenoughcashstranger);
		else {
			database.incValue(mongo_client, msg.member.user.id, 'money', -75);
			let numbers = [];
			while (numbers.length < 6) {
				let random_number = Math.floor(Math.random() * 25) + 1;
				if (numbers.indexOf(random_number) === -1) numbers.push(random_number);
			}
			lottery_tickets.push({user: msg.member.user.id, numbers: numbers});
			database.setValue(mongo_client, msg.guild.id, 'lottery_tickets', lottery_tickets);
			msg.reply(
				`${translation[lang].lottery_bought}${numbers[0]}, ${numbers[1]}, ${numbers[2]}, ${numbers[3]}, ${numbers[4]}, ${numbers[5]}`
			);
		}
	}
};
