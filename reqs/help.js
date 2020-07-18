const fs = require('fs')
const ru = JSON.parse(fs.readFileSync('./translations/ru.json'))
const en = JSON.parse(fs.readFileSync('./translations/en.json'))

async function help(msg, lang) {
	switch(msg.content.split(' ')[1]) {
		default:
			msg.channel.send(eval(`${lang}.help_main`))
			break
		case 'help':
			msg.channel.send(eval(`${lang}.help_help`))
			break
		case 'owl': 
			msg.channel.send(eval(`${lang}.help_owl`))
			break
		case 'prb':
			msg.channel.send(eval(`${lang}.help_prb`))
			break
		case 'egg':
			msg.channel.send(eval(`${lang}.help_egg`))
			break
		case 'rr':
			msg.channel.send(eval(`${lang}.help_rr`))
			break
		case 'daily':
			msg.channel.send(eval(`${lang}.help_daily`))
			break
		case 'money':
			msg.channel.send(eval(`${lang}.help_money`))
			break
	}
}

module.exports.help = help

/*case 'translate':
			msg.channel.send(`translate - translates text, your message should look like this:
!translate xx-yy <text>

xx - source language(e.g. en)
yy - target language (e.g. ru)

You can also use only the target language, in that case the source language will be identified automatically

Supported languages can be found here: <https://tech.yandex.com/translate/doc/dg/concepts/api-overview-docpage/#api-overview__languages>`)*/