require("dotenv").config()
const db = process.env.DB

async function getValue(mongo_client, id, collection) {
  var query = {id: id}
  var result = await mongo_client.db(db).collection(collection).findOne(query, {projection: { _id: 0, id: 0}})
  if (result === null) {return undefined}
  else {return result.value}
}

async function incValue(mongo_client, id, collection, amount) {
  var query = {id: id}
  var inc = {$inc: {value: amount}}
  mongo_client.db(db).collection(collection).updateOne(query, inc, {upsert: true})
  return
}

async function setValue(mongo_client, id, collection, value) {
  var query = {id: id}
  var set = {$set: {value: value}}
  mongo_client.db(db).collection(collection).updateOne(query, set, {upsert: true})
  return
}

module.exports.getValue = getValue
module.exports.incValue = incValue
module.exports.setValue = setValue