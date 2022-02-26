module.exports = async function help(msg, mongo_client) {
	let database = require('../database.js');
	let fs = require('fs');
	let translation = JSON.parse(fs.readFileSync('./reqs/translation.json'));
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
	try {
		let command = msg.content.split(' ')[1];
		if (command === undefined) msg.channel.send(translation[lang].help_main);
		else msg.channel.send(eval(`translation[lang].help_${command}`));
	} catch (error) {
		console.log(error);
	}
};
