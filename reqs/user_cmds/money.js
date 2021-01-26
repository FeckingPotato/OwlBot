module.exports = async function money(msg, mongo_client, database, translation) {
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
	let money = await database.getValue(mongo_client, msg.member.user.id, 'money');
	if (!money) money = 0;
	let response = translation[lang].money_reply + money;
	msg.reply(response);
};
