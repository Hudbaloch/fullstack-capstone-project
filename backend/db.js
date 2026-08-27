const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
  await client.connect();
  return client.db("giftlink");
}

module.exports = { connectToDatabase };