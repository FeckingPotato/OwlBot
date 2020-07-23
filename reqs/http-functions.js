const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
const download = require('download-file') 

var owl_options = {
    directory: './',
    filename: 'owl.jpg',
	timeout: 200000
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.open( "GET", theUrl, false )
    xmlHttp.send( null )
    return xmlHttp.responseText
}

function owl(){
	var owl_get = httpGet('https://api.unsplash.com/photos/random?client_id=fc0099a015add49bc7ebd540c06c138792b72f71e5c28fef76464e3bdb0439af&query=owl'||'https://api.unsplash.com/photos/random?client_id=fc0099a015add49bc7ebd540c06c138792b72f71e5c28fef76464e3bdb0439af&query=owls')
	var owl_parse = JSON.parse(owl_get) 
	var owl_url = owl_parse.urls.small
	download(owl_url, owl_options);
	return 
}

module.exports.owl = owl