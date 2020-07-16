require("dotenv").config
const token = process.env.TOKEN
const {Discord, Client, MessageAttachment, Guild} = require('discord.js')
const client = new Client()
const guild = new Guild(client)
const fs = require('fs')
let data = JSON.parse(fs.readFileSync('./data.json'))
let cmd_ru = require('./reqs/commands.js')
let cmd_economy_ru = require('./reqs/commands-economy.js')
let help_ru = require('./reqs/help.js').help
let cmd_en = require('./reqs/commands_en.js')
let help_en = require('./reqs/help_en.js').help

var cooldown_owl = 0

client.login(token)
client.on('message', msg => {
	if (eval("data.lang.g"+msg.guild.id) == 'ru') {
		cmd = cmd_ru
		help = help_ru
	}
	else {
		cmd = cmd_en
		help = help_en
	}
	if (msg.content.startsWith('!')) {
		switch (msg.content.split(' ')[0]) {
			case '!daily':
				cmd_economy_ru.daily(msg)
				break
			case '!owl':
				if (cooldown_owl === 1) {
					msg.channel.send('Подождите немного перед использованием команды !owl')
				}
				else {
					cmd.owl(msg)
					cooldown_owl = 1
					setTimeout(() => cooldown_owl = 0, 2000)
				}
				break
			case '!rr':
				cmd.rr(msg)
				break
			case '!prb':
				cmd.prb(msg)
				break
			case '!egg':
				cmd.egg(msg)
				break
			case '!translate':
				cmd.translate(msg)
				break
			case '!help':
				help(msg)
				break
			case '!lang':
				if (msg.member.hasPermission("ADMINISTRATOR")) {
					if (msg.content === '!lang') {
						if (eval("JSON.parse(fs.readFileSync('data.json')).lang.a"+msg.guild.id) !== undefined) {
							msg.channel.send(eval("JSON.parse(fs.readFileSync('data.json')).lang.a"+msg.guild.id))
						}
						else {
							eval("data.lang.a"+msg.guild.id+" = 'en'")
							fs.writeFileSync('data.json', JSON.stringify(data), 'utf-8')
							msg.channel.send(eval("JSON.parse(fs.readFileSync('data.json')).lang.a"+msg.guild.id))
						}
					}
					else {
						switch (msg.content.split(' ')[1]) {
							default:
								msg.channel.send('Only "en" and "ru" can be used with !lang')
								break
							case 'en':
								eval("data.lang.g"+msg.guild.id+" = 'en'")
								fs.writeFileSync('data.json', JSON.stringify(data), 'utf-8')
								break
							case 'ru':
								eval("data.lang.g"+msg.guild.id+" = 'ru'")
								fs.writeFileSync('data.json', JSON.stringify(data), 'utf-8')
								break
						}
					}
				}
				break
		
}}})