module.exports = async function prb(msg, mongo_client, database, translation) { //real
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
	if (msg.content === '!prb') msg.reply(translation[lang].prb_nothing);
	else msg.reply(translation[lang].prb_something + Math.floor(Math.random() * 100) + '%');
};
