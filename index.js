require("dotenv").config()
const token = process.env.TOKEN

const {Client} = require('discord.js')
const discord_client = new Client()
const {MongoClient} = require('mongodb')
const mongo_client = new MongoClient(process.env.URI, {useUnifiedTopology: true})
const fs = require('fs')

const usr_cmd = require('./reqs/user_commands.js')
const adm_cmd = require('./reqs/admin_commands.js')
const database = require('./reqs/database.js')
const http = require('./reqs/http-functions.js')

fs.exists('./owl.jpg', exists => {if (!exists) http.owl()})

mongo_client.connect(() => {
	discord_client.login(token)
	console.log('working')
	discord_client.on('message', async function (msg) {
		if (msg.content.startsWith('!')) {
			var lang = await database.getValue(mongo_client, msg.channel.id, 'language')
			if (lang === undefined) {database.setValue(mongo_client, msg.channel.id, 'language', 'en')}
			try {eval(`usr_cmd.${msg.content.split(' ')[0].replace('!', '')}(msg, mongo_client)`)}
			catch (error) {console.log(error)}
		}
		else if ((msg.content.startsWith('*')) && (msg.member.hasPermission("ADMINISTRATOR"))) {
			try {eval(`adm_cmd.${msg.content.split(' ')[0].replace('*', '')}(msg, mongo_client)`)}
			catch (error) {console.log(error)}
		}
	})
	discord_client.on('roleDelete', async function (role) {
		var roles = await database.getValue(mongo_client, role.guild.id, 'role_prices')
		var i
		for (i = 0; i < roles.length; i++) {
			if (role.id == Object.values(roles[i])[0]) {
				roles.splice(i, 1)
				console.log(roles)
				database.setValue(mongo_client, role.guild.id, 'role_prices', roles)
				break
			}
		}
	})
})

const express = require('express')

  var app = express()

  app.get('/', function (req, res) {
    res.send(`Бот работает
    The bot is working`)
  })

  app.listen(process.env.PORT)