const fs = require('fs')

if (!fs.existsSync('./data')) {fs.mkdirSync('data')}

if (!fs.existsSync('./data/egg-сount.json')) {fs.writeFileSync('./data/egg-count.json', '{}')}

if (!fs.existsSync('./data/money.json')) {fs.writeFileSync('./data/money.json', '{}')}

if (!fs.existsSync('./data/language.json')) {fs.writeFileSync('./data/language.json', '{}')}

if (!fs.existsSync('./data/daily-cooldown.json')) {fs.writeFileSync('./data/daily-cooldown.json', '{}')}
