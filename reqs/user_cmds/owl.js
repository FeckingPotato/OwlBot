module.exports = async function owl(msg) {
	let attachment = new MessageAttachment('./owl.jpg');
	msg.channel.send(attachment);
	http.owl();
};
