const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
const download = require('download-file') 

let owl_options = {
    directory: './',
    filename: 'owl.jpg',
	timeout: 200000
}

function httpGet(theUrl) {
    let xmlHttp = new XMLHttpRequest()
    xmlHttp.open( "GET", theUrl, false )
    xmlHttp.send( null )
    return xmlHttp.responseText
}

function owl(){
	let owl_get = httpGet('https://api.unsplash.com/photos/random?client_id=fc0099a015add49bc7ebd540c06c138792b72f71e5c28fef76464e3bdb0439af&query=owl'||'https://api.unsplash.com/photos/random?client_id=fc0099a015add49bc7ebd540c06c138792b72f71e5c28fef76464e3bdb0439af&query=owls')
	let owl_parse = JSON.parse(owl_get) 
	let owl_url = owl_parse.urls.small
	download(owl_url, owl_options);
	return 
}

module.exports.owl = owl