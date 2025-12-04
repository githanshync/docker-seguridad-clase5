// backend/src/server.js
// API crud min. y cache hit miss
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { connectMongo, PostModel } = require('./db');
const { redisClient, cacheGet, cacheSet, cacheDel } = require('./cache');

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/api/health', async (req, res) => {
  try {
    // para ping redis y mongo
    await redisClient.ping();
    await PostModel.findOne().lean();
    res.json({ status: 'OK' });
  } catch (err) {
    res.status(500).json({ status: 'Error', error: err.message });
  }
});
// listar posteos
app.get('/api/posts', async (req, res) => {
  const key = 'posts_all';
  try {
    const cached = await cacheGet(key);
    if (cached) {
      return res.json({ source: 'cache', data: JSON.parse(cached) });
    }
    const posts = await PostModel.find().sort({ createdAt: -1 }).lean();
    await cacheSet(key, JSON.stringify(posts), 60); // TTL 60s
    res.json({ source: 'database', data: posts });
  } catch (err) {
    // capturando error
    res.status(500).json({ error: err.message });
  }
});
// endpoint 2 ver post
app.get('/api/posts/:id', async (req, res) => {
  const id = req.params.id;
  const key = `post_${id}`;
  try {
    const cached = await cacheGet(key);
    if (cached) {
      return res.json({ source: 'cache', data: JSON.parse(cached) });
    }
    const post = await PostModel.findById(id).lean();
    if (!post) return res.status(404).json({ error: 'Not found' });
    await cacheSet(key, JSON.stringify(post), 60);
    res.json({ source: 'database', data: post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Crear post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'title and content are required' });
    const post = await PostModel.create({ title, content, author: author || 'anonymous' });
    // invalidar caches
    await cacheDel('posts_all');
    await cacheDel(`post_${post._id}`);
    res.status(201).json({ created: true, data: post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectMongo();
    await redisClient.connect();
    app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
})();
