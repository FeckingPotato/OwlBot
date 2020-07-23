require("dotenv").config()
const token = process.env.TOKEN

const {Discord, Client, MessageAttachment} = require('discord.js')
const discord_client = new Client()
const {MongoClient} = require('mongodb')
const mongo_client = new MongoClient(process.env.URI, {useUnifiedTopology: true})

const usr_cmd = require('./reqs/user_commands.js')
const adm_cmd = require('./reqs/admin_commands.js')
const database = require('./reqs/database.js')
const http = require('./reqs/http-functions.js')

//http.owl()
mongo_client.connect(() => {
	discord_client.login(token)
	console.log('working')
	discord_client.on('message', msg => {
		if (msg.content.startsWith('!')) {
			if (database.getValue(mongo_client, msg.guild.id, 'language') === undefined) {database.setValue(mongo_client, msg.guild.id, 'language', 'en')}
			try {eval(`usr_cmd.${msg.content.split(' ')[0].replace('!', '')}(msg, mongo_client)`)}
			catch (error) {console.log(error)}
		}
		else if ((msg.content.startsWith('*')) && (msg.member.hasPermission("ADMINISTRATOR"))) {
			try {eval(`adm_cmd.${msg.content.split(' ')[0].replace('*', '')}(msg, mongo_client)`)}
			catch (error) {console.log(error)}
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