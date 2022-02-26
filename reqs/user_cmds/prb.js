module.exports = async function prb(msg, mongo_client) { //real
	let database = require('../database.js');
	let fs = require('fs');
	let translation = JSON.parse(fs.readFileSync('./reqs/translation.json'));
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
	if (msg.content === '!prb') msg.reply(translation[lang].prb_nothing);
	else msg.reply(translation[lang].prb_something + Math.floor(Math.random() * 100) + '%');
};
