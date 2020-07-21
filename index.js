require("dotenv").config()
const token = process.env.TOKEN

const {Discord, Client, MessageAttachment} = require('discord.js')
const discord_client = new Client()
const {MongoClient} = require('mongodb')
const mongo_client = new MongoClient(process.env.URI, {useUnifiedTopology: true})

const fun_cmd = require('./reqs/fun_commands.js')
const ecn_cmd = require('./reqs/economy_commands.js')
const adm_cmd = require('./reqs/admin_commands.js')
const help = require('./reqs/help.js').help
const database = require('./reqs/database.js')
const http = require('./reqs/http-functions.js')

var cooldown_owl = 0

http.owl()
mongo_client.connect(() => {
	discord_client.login(token)
	console.log('working')
	discord_client.on('message', msg => {
		if (msg.content.startsWith('!')) {
			switch (msg.content.split(' ')[0]) {
				case '!money':
					ecn_cmd.money(msg, mongo_client)
					break
				case '!daily':
					ecn_cmd.daily(msg, mongo_client)
					break
				case '!owl':
					if (cooldown_owl === 0) {
						fun_cmd.owl(msg)
						cooldown_owl = 1
						setTimeout(() => cooldown_owl = 0, 2000)
					}
					break
				case '!rr':
					fun_cmd.rr(msg, mongo_client)
					break
				case '!prb':
					fun_cmd.prb(msg, mongo_client)
					break
				case '!egg':
					fun_cmd.egg(msg, mongo_client)
					break
				case '!help':
					help(msg, mongo_client)
					break
			}
		}
		else if ((msg.content.startsWith('*')) || (msg.member.hasPermission("ADMINISTRATOR"))) {
			switch (msg.content.split(' ')[0]) {
				case '*lang':
					adm_cmd.language(msg, mongo_client)
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
http.keep_awake()