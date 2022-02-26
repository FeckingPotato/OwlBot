require('dotenv').config()
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
	let owl_get = httpGet(`https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_TOKEN}&query=owl`||`https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_TOKEN}&query=owls`)
	let owl_parse = JSON.parse(owl_get) 
	let owl_url = owl_parse.urls.small
	download(owl_url, owl_options);
	return 
}

module.exports.owl = owl