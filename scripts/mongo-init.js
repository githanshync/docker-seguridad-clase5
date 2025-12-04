// scripts/mongo-init.js
db = db.getSiblingDB('blog');
db.createCollection('posts');
db.posts.insertOne({
  title: 'Hola..',
  content: 'Primer post de ejemplo.',
  author: 'system',
  createdAt: new Date(),
  updatedAt: new Date()
});
