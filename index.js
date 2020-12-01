require('dotenv').config();
const token = process.env.TOKEN;

const {Client} = require('discord.js');
const discord_client = new Client();
const {MongoClient} = require('mongodb');
const mongo_client = new MongoClient(process.env.URI, {useUnifiedTopology: true});
const fs = require('fs');

const database = require('./reqs/database.js');
const lottery = require('./reqs/lottery.js');
const http = require('./reqs/http-functions.js');

if (!fs.existsSync('./owl.jpg')) http.owl();

mongo_client.connect(() => {
	discord_client.login(token);
	discord_client.on('ready', () => {
		console.log('working');
		let startup_date = new Date();
		let startup_minutes = startup_date.getMinutes() * 60000;
		if (startup_minutes === 0) startup_minutes = 3600000;
		setTimeout(() => {
			lottery(discord_client, mongo_client);
			setInterval(() => {
				lottery(discord_client, mongo_client);
			}, 3600000);
		}, 3600000 - startup_minutes);
	});
	discord_client.on('message', async (msg) => {
		if (msg.content.startsWith('!')) {
			let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
			if (lang === undefined) {
				database.setValue(mongo_client, msg.channel.id, 'language', 'en');
			}
			try {
				require(`./reqs/user_cmds/${msg.content.split(' ')[0].replace('!', '')}.js`)(msg, mongo_client);
			} catch (error) {
				console.log(error);
			}
		} else if (msg.content.startsWith('*') && msg.member.hasPermission('ADMINISTRATOR')) {
			let lang = await database.getValue(mongo_client, msg.channel.id, 'language');
			if (lang === undefined) {
				database.setValue(mongo_client, msg.channel.id, 'language', 'en');
			}
			try {
				require(`./reqs/admin_cmds/${msg.content.split(' ')[0].replace('*', '')}.js`)(msg, mongo_client);
			} catch (error) {
				console.log(error);
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