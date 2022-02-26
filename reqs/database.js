require("dotenv").config()
const db = process.env.DB

async function getValue(mongo_client, id, collection) {
  let query = {id: id}
  let result = await mongo_client.db(db).collection(collection).findOne(query, {projection: { _id: 0, id: 0}})
  if (result === null) return undefined
  else return result.value
}

async function incValue(mongo_client, id, collection, amount) {
  let query = {id: id}
  let inc = {$inc: {value: amount}}
  mongo_client.db(db).collection(collection).updateOne(query, inc, {upsert: true})
  return
}

async function setValue(mongo_client, id, collection, value) {
  let query = {id: id}
  let set = {$set: {value: value}}
  mongo_client.db(db).collection(collection).updateOne(query, set, {upsert: true})
  return
}

async function getDocuments(mongo_client, collection) {
  let result = await mongo_client.db(db).collection(collection).find({}, {projection: { _id: 0}}).toArray()
  return result
}

async function deleteDocument(mongo_client, id, collection) {
  mongo_client.db(db).collection(collection).deleteOne({id: id})
  return
}

module.exports.getValue = getValue
module.exports.incValue = incValue
module.exports.setValue = setValue
module.exports.getDocuments = getDocuments
module.exports.deleteDocument = deleteDocument