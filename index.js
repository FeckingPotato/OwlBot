require('dotenv').config();
const token = process.env.TOKEN;

const {Client} = require('discord.js');
const discord_client = new Client();
const {MongoClient} = require('mongodb');
const mongo_client = new MongoClient(process.env.URI, {useUnifiedTopology: true});
const fs = require('fs');

const database = require('./reqs/database.js');
const translation = JSON.parse(fs.readFileSync('./reqs/translation.json'));

if (!fs.existsSync('./owl.jpg')) require('./reqs/http-functions.js').owl();

mongo_client.connect(() => {
	discord_client.login(token);
	discord_client.on('ready', () => {
		console.log('working');
	});

	discord_client.on('message', async (msg) => {
		if (msg.content.startsWith('!')) {
			let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
			let module_path = `./reqs/user_cmds/${msg.content.split(' ')[0].replace('!', '')}.js`;
			if (!lang) {
				database.setValue(mongo_client, msg.channel.id, 'language', 'en');
			}
			if (fs.existsSync(module_path)){
				require(module_path)(msg, mongo_client, database, translation, fs);
			}
		} else if (msg.content.startsWith('*') && msg.member.hasPermission('ADMINISTRATOR')) {
			let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
			let module_path = `./reqs/admin_cmds/${msg.content.split(' ')[0].replace('*', '')}.js`;
			if (!lang) {
				database.setValue(mongo_client, msg.channel.id, 'language', 'en');
			}
			if (fs.existsSync(module_path)) {
				require()(msg, mongo_client, database, translation, fs);
			}
		}
	});
	discord_client.on('roleDelete', async (role) => {
		let roles = await database.getValue(mongo_client, role.guild.id, 'role_prices');
		let i;
		for (i = 0; i < roles.length; i++) {
			if (role.id == Object.values(roles[i])[0]) {
				roles.splice(i, 1);
				console.log(roles);
				database.setValue(mongo_client, role.guild.id, 'role_prices', roles);
				break;
			}
		}
	});
});