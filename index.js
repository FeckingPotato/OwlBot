require('./reqs/data-checker.js')
require("dotenv").config()
const token = process.env.TOKEN

const {Discord, Client, MessageAttachment, Guild} = require('discord.js')
const client = new Client()
const guild = new Guild(client)
const fs = require('fs')

const fun_cmd = require('./reqs/fun_commands.js')
const ecn_cmd = require('./reqs/economy_commands.js')
const help = require('./reqs/help.js').help

var lang = JSON.parse(fs.readFileSync('./data/language.json'))
var cmd_lang = 'en'
var cooldown_owl = 0

client.login(token)
client.on('message', msg => {
	if (eval("lang.g"+msg.guild.id) == 'ru') {
		cmd_lang = 'ru'
	}
	else {
		cmd_lang = 'en'
	}
	if ((msg.content.startsWith('!')) || (msg.content.startsWith('*'))) {
		switch (msg.content.split(' ')[0]) {
			case '!money':
				ecn_cmd.money(msg, cmd_lang)
				break
			case '!daily':
				ecn_cmd.daily(msg, cmd_lang)
				break
			case '!owl':
				if (cooldown_owl === 0) {
					fun_cmd.owl(msg)
					cooldown_owl = 1
					setTimeout(() => cooldown_owl = 0, 2000)
				}
				break
			case '!rr':
				fun_cmd.rr(msg, cmd_lang)
				break
			case '!prb':
				fun_cmd.prb(msg, cmd_lang)
				break
			case '!egg':
				fun_cmd.egg(msg, cmd_lang)
				break
			case '!help':
				help(msg, cmd_lang)
				break
			case '*lang':
				if (msg.member.hasPermission("ADMINISTRATOR")) {
					if (msg.content === '*lang') {
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
								msg.channel.send('Only "en" and "ru" can be used with *lang')
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