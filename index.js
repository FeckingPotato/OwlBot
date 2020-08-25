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

async function lottery(discord_client, mongo_client) {
	let documents = await database.getDocuments(mongo_client, 'lottery')
	for (let i = 0; i < documents.length; i++) {
		let date = new Date()
		let document = documents[i]
		if (date.getHours() === document.value.time) {
			let numbers = []
			while (numbers.length < 6) {
				let random_number = Math.floor(Math.random()*25)+1
				if(numbers.indexOf(random_number) === -1) numbers.push(random_number)
			}
			let lottery_tickets = await database.getValue(mongo_client, document.id, 'lottery_tickets')
			if (lottery_tickets === undefined) lottery_tickets = []
			for (let i = 0; i < lottery_tickets.length; i++) {
				let lottery_ticket_person = lottery_tickets[i]
				let winner_tier = 0
				for (let i = 0; i < numbers.length; i++) {
					if (lottery_ticket_person.numbers.indexOf(numbers[i]) !== -1) {
						winner_tier++
					}
				}
				switch (winner_tier) {
					case 1:
						database.incValue(mongo_client, lottery_ticket_person.user, 'money', 75)
						break
					case 2:
						database.incValue(mongo_client, lottery_ticket_person.user, 'money', 200)
						break
					case 3:
						database.incValue(mongo_client, lottery_ticket_person.user, 'money', 400)
						break
					case 4:
						database.incValue(mongo_client, lottery_ticket_person.user, 'money', 750)
						break
					case 5:
						database.incValue(mongo_client, lottery_ticket_person.user, 'money', 1500)
						break
					case 6:
						database.incValue(mongo_client, document.user, 'money', 2000)
						break
				}
			}
			let channel = discord_client.channels.cache.get(documents[i].value.channel)
			channel.send(numbers.join(', '))
			database.deleteDocument(mongo_client, channel.guild.id, 'lottery_tickets')
		}
	}
}

mongo_client.connect(() => {
	discord_client.login(token)
	discord_client.on("ready", async function() {
		console.log('working')
		let startup_date = new Date()
		let startup_minutes = startup_date.getMinutes() * 60000
		if (startup_minutes === 0) startup_minutes = 3600000
		setTimeout(async function() {
			lottery(discord_client, mongo_client)
			setInterval((async function() {
				lottery(discord_client, mongo_client)
			}), 3600000)
		}, 3600000 - startup_minutes)
	})
	discord_client.on('message', async function (msg) {
		if (msg.content.startsWith('!')) {
			let lang = await database.getValue(mongo_client, msg.channel.id, 'language')
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
		let roles = await database.getValue(mongo_client, role.guild.id, 'role_prices')
		let i
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

  let app = express()

  app.get('/', function (req, res) {
    res.send(`Бот работает
    The bot is working`)
  })

  app.listen(process.env.PORT)