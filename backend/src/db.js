// conexion a mongodb
// backend/src/db.js
const mongoose = require('mongoose');
const fs = require('fs');

function getMongoUri() {
  if (process.env.MONGO_URI_FILE) {
    return fs.readFileSync(process.env.MONGO_URI_FILE, 'utf8').trim();
  }
  return process.env.MONGO_URI || 'mongodb://db:27017/blog';
}

const PostSchema = new mongoose.Schema(
  { title: String, content: String },
  { timestamps: true }
);

const PostModel = mongoose.model('Post', PostSchema);

async function connectMongo() {
  const uri = getMongoUri();
  await mongoose.connect(uri, { dbName: 'blog' });
  console.log('Mongo connected');
}

module.exports = { connectMongo, PostModel };

