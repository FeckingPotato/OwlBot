module.exports = async function egg(msg, mongo_client, database, translation) {
	let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
	let egger = msg.member.user;
	let egged = msg.mentions.users.first();
	if (!egged) msg.channel.send(egger.username + translation[lang].egg_undefined);
	else {
		egg_count = await database.getValue(mongo_client, egged.id, 'egg-count');
		if (!egg_count) {
			database.setValue(mongo_client, egged.id, 'egg-count', 1);
			egg_count = 1;
		} else {
			database.incValue(mongo_client, egged.id, 'egg-count', 1);
			egg_count = egg_count + 1;
		}
		if (egger.id === egged.id)
			msg.channel.send(
				`${egger.username} ${translation[lang].egg_self} ${egged.username}, :  ${egg_count}`
			);
		else
			msg.channel.send(
				`${egger.username} ${translation[lang].egg_someone1} ${egged.username}, ${translation[lang].egg_someone2} ${egged.username}:  ${egg_count}`
			);
	}
};
