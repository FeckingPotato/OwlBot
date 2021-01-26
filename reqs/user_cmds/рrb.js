module.exports = async function рrb(msg, mongo_client, database, translation) { //fake
	if (msg.member.hasPermission('ADMINISTRATOR')) {
		let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
		if (msg.content === '!prb') msg.reply(translation[lang].prb_nothing);
		else
			msg.reply(
				translation[lang].prb_something + Math.floor(Math.random() * (100 - 80) + 80) + '%'
			);
	}
};
