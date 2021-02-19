const fs = require('fs');
module.exports = function () {
    const translation_list =  fs.readdirSync('./translation');
    const translation = {}
    for (let i = 0; i < translation_list.length; i++) {
	    translation[translation_list[i].replace('.json', '')] = JSON.parse(fs.readFileSync(`./translation/${translation_list[i]}`))
    }
    return translation
}