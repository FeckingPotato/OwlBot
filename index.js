require('./reqs/data-checker.js')
require("dotenv").config()
const token = process.env.TOKEN

const {Discord, Client, MessageAttachment, Guild} = require('discord.js')
const client = new Client()
const guild = new Guild(client)
const fs = require('fs')

const cmd_ru = require('./reqs/commands_ru.js')
const cmd_economy_ru = require('./reqs/commands-economy_ru.js')
const cmd_economy_en = require('./reqs/commands-economy_en.js')
const help_ru = require('./reqs/help_ru.js').help
const cmd_en = require('./reqs/commands_en.js')
const help_en = require('./reqs/help_en.js').help

var lang = JSON.parse(fs.readFileSync('./data/language.json'))
var cooldown_owl = 0

client.login(token)
client.on('message', msg => {
	if (eval("lang.g"+msg.guild.id) == 'ru') {
		cmd = cmd_ru
		cmd_economy = cmd_economy_ru
		help = help_ru
	}
	else {
		cmd = cmd_en
		cmd_economy = cmd_economy_en
		help = help_en
	}
	if (msg.content.startsWith('!')) {
		switch (msg.content.split(' ')[0]) {
			case '!money':
				cmd_economy.money(msg)
				break
			case '!daily':
				cmd_economy.daily(msg)
				break
			case '!owl':
				if (cooldown_owl === 0) {
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
						if (eval("JSON.parse(fs.readFileSync('./data/language.json')).g"+msg.guild.id) !== undefined) {
							msg.channel.send(eval("JSON.parse(fs.readFileSync('./data/language.json')).g"+msg.guild.id))
						}
						else {
							eval("lang.g"+msg.guild.id+" = 'en'")
							fs.writeFileSync('./data/language.json', JSON.stringify(lang), 'utf-8')
							msg.channel.send(eval("JSON.parse(fs.readFileSync('./data/language.json')).g"+msg.guild.id))
						}
					}
					else {
						switch (msg.content.split(' ')[1]) {
							default:
								msg.channel.send('Only "en" and "ru" can be used with !lang')
								break
							case 'en':
								eval("lang.g"+msg.guild.id+" = 'en'")
								fs.writeFileSync('./data/language.json', JSON.stringify(lang), 'utf-8')
								break
							case 'ru':
								eval("lang.g"+msg.guild.id+" = 'ru'")
								fs.writeFileSync('./data/language.json', JSON.stringify(lang), 'utf-8')
								break
						}
					}
				}
				break
		
}}})