async function help(msg) {
	switch(msg.content.split(' ')[1]) {
		default:
			msg.channel.send(`! - префикс для ввода команд
help - список команд
owl - получить фотографию совы
rr - сыграть в русскую рулетку
prb x - вероятность события x
egg x - кинуть яйцо в пользователя x
money - узнать количество денег
daily - получить ежедневную награду
translate y x - перевод текста x по направлению y
Подробное описание команды: !help <команда>`)
			break
		case 'help':
			msg.channel.send('help - отправляет описание команд (логично, да?)')
			break
		case 'owl': 
			msg.channel.send('owl - отправляет случайную фотографию совы с сайта Unsplash, может занять некоторое время из-за низкой производительности сервера')
			break
		case 'prb':
			msg.channel.send('infa - отправляет вероятность события в процентах, полученную точно не при помощи генератора случайных чисел')
			break
		case 'egg':
			msg.channel.send('egg - кидает яйцо в указанного пользователя и отображает количество всех яиц, которые были кинуты в него')
			break
		case 'rr':
			msg.channel.send('rr - позволяет сыграть в русскую рулетку, в случае проигрыша на 2 минуты выдаётся роль "ded"')
			break
		case 'daily':
			msg.channel.send('daily - выдаёт 100 денег, можно использовать раз в 24 часа')
			break
		case 'money':
			msg.channel.send('money - отображает количество денег')
		case 'translate':
			msg.channel.send(`translate - переводит текст, сообщение должно выглядеть так:
!translate xx-yy <текст>

xx - исходный язык(например en)
yy - конечный язык (например ru)

Возможен вариант использования только конечного языка, в таком случае исходный язык будет определён автоматически

Поддерживаемые языки можно найти здесь: <https://yandex.ru/dev/translate/doc/dg/concepts/api-overview-docpage/#api-overview__languages>`)
				}
}

module.exports.help = help