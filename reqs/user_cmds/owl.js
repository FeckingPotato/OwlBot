module.exports = async function owl(msg) {
    let http = require('../http-functions.js');
	let {MessageAttachment} = require('discord.js');
	let attachment = new MessageAttachment('./owl.jpg');
	msg.channel.send(attachment);
	http.owl();
};
