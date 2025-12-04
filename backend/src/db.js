// conexion a mongodb
// backend/src/db.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: 'anonymous' },
  },
  { timestamps: true }
);

const PostModel = mongoose.model('Post', PostSchema);

async function connectMongo() {
  const uri = process.env.MONGO_URI || 'mongodb://db:27017/blog';
  await mongoose.connect(uri, { dbName: process.env.MONGO_DB || 'blog' });
  console.log('Mongo conectado');
}

module.exports = { connectMongo, PostModel };

