module.exports = async function help(msg, mongo_client, database, translation) {
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
	let command = msg.content.split(' ')[1];
	if (!command) msg.channel.send(translation[lang].help_main);
	else {
		let translation = `translation[lang].help_${command}`;
		if (translation) msg.channel.send(eval(`translation[lang].help_${command}`));
	}
};
