const fs = require('fs')

try {fs.readFileSync('./data/egg-сount.json')}
catch {fs.writeFileSync('./data/egg-count.json', '{}')}

try {fs.readFileSync('./data/money.json')}
catch {fs.writeFileSync('./data/money.json', '{}')}

try {fs.readFileSync('./data/language.json')}
catch {fs.writeFileSync('./data/language.json', '{}')}

try {fs.readFileSync('./data/daily-cooldown.json')}
catch {fs.writeFileSync('./data/daily-cooldown.json', '{}')}
