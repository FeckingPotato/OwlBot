async function help(msg) {
	switch(msg.content.split(' ')[1]) {
		default:
			msg.channel.send(`! - command prefix
help - get this list of commands
owl - get a photo of an owl
rr - play Russian roulette
prb <something> - probability of something
egg <@person> - throw an egg at someone
daily - get the daily reward
translate <language pair> <text> - translates some text
Better command description: !help <command>`)
			break
		case 'help':
			msg.channel.send('help - helps you')
			break
		case 'owl': 
			msg.channel.send('owl - sends a random photo of a random owl by using Unsplash, that can take some time due to bad performance of the server')
			break
		case 'infa':
			msg.channel.send('prb - sends the probability of something, the probability is definitely not generated randomly')
			break
		case 'egg':
			msg.channel.send('egg - allows you to throw an agg at someone')
			break
		case 'rr':
			msg.channel.send('rr - allows you to play Russian roullete, in case of death you become "ded"')
			break
		case 'daily':
			msg.channel.send('daily - you get 100 moneys, the cooldown is 24 hours')
			break
		case 'translate':
			msg.channel.send(`translate - translates text, your message should look like this:
!translate xx-yy <text>

xx - source language(e.g. en)
yy - target language (e.g. ru)

You can also use only the target language, in that case the source language will be identified automatically

Supported languages can be found here: <https://tech.yandex.com/translate/doc/dg/concepts/api-overview-docpage/#api-overview__languages>`)
				}
}

module.exports.help = help