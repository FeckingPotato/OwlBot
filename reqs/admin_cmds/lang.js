module.exports = async function lang(msg, mongo_client) {
	let database = require('../database.js');
	let fs = require('fs');
	let translation = JSON.parse(fs.readFileSync('./reqs/translation.json'));
	switch (msg.content.split(' ')[1]) {
		case 'en':
			database.setValue(mongo_client, msg.channel.id, 'language', 'en');
			msg.channel.send(translation.en.adm_setlang);
			break;
		case 'ru':
			database.setValue(mongo_client, msg.channel.id, 'language', 'ru');
			msg.channel.send(translation.ru.adm_setlang);
			break;
	}
};
