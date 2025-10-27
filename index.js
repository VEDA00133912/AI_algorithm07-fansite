require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const getLatestVideos = require('./utils/getLatestVideos');
const basicAuth = require('./utils/basicAuth');
const autoLink = require('./utils/convertLink');
const News = require('./data/news_db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/admin', basicAuth);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB接続成功'))
  .catch(err => console.error('MongoDB接続失敗', err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

async function getLatestNews(limit = 10) {
  return await News.find().sort({ date: -1 }).limit(limit);
}

app.get('/', async (req, res) => {
  const vtuber = JSON.parse(fs.readFileSync('./data/vtuber_info.json', 'utf8'));
  const videos = await getLatestVideos();
  const newsRaw = await getLatestNews();

  const news = newsRaw.map(item => ({
    ...item._doc,
    body: autoLink(item.body.replace(/\n/g, '<br>'))
  }));

  vtuber.introduction = vtuber.introduction.replace(/\n/g, '<br>');
  vtuber.videos = videos;
  vtuber.news = news;

  res.render('index', { vtuber });
});

app.get('/admin/news', async (req, res) => {
  const news = await News.find().sort({ date: -1 });
  res.render('admin_news_list', { news });
});

app.get('/admin/news/new', (req, res) => {
  res.render('admin_news_form', { news: null });
});

app.get('/admin/news/edit/:id', async (req, res) => {
  const news = await News.findById(req.params.id);
  if (!news) return res.status(404).send('ニュースが見つかりません');
  res.render('admin_news_form', { news });
});

app.post('/admin/news/save', async (req, res) => {
  const { id, title, body, date } = req.body;
  if (id) {
    await News.findByIdAndUpdate(id, { title, body, date });
  } else {
    await News.create({ title, body, date });
  }
  res.redirect('/admin/news');
});

app.post('/admin/news/delete/:id', async (req, res) => {
  await News.findByIdAndDelete(req.params.id);
  res.redirect('/admin/news');
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} で起動中`);
});
