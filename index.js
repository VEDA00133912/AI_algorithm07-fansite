require('dotenv').config();
const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const bodyParser = require('body-parser');
const fs = require('fs');
const getLatestVideos = require('./utils/getLatestVideos');
const basicAuth = require('./utils/basicAuth');
const autoLink = require('./utils/convertLink')

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/admin', basicAuth);

const db = new Database('data/news.db');
db.prepare(`
CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  date TEXT NOT NULL
)
`).run();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

function getLatestNews(limit = 5) {
  return db.prepare('SELECT * FROM news ORDER BY date DESC LIMIT ?').all(limit);
}

app.get('/', async (req, res) => {
  const vtuber = JSON.parse(fs.readFileSync('./data/vtuber_info.json', 'utf8'));
  
  const videos = await getLatestVideos();
  const newsRaw = getLatestNews();

  const news = newsRaw.map(item => ({
    ...item,
    body: autoLink(item.body)
  }));

  vtuber.introduction = vtuber.introduction.replace(/\n/g, "<br>");
  vtuber.videos = videos;
  vtuber.news = news;

  res.render('index', { vtuber });
});

app.get('/admin/news', (req, res) => {
  const news = db.prepare('SELECT * FROM news ORDER BY date DESC').all();
  res.render('admin_news_list', { news });
});

app.get('/admin/news/new', (req, res) => {
  res.render('admin_news_form', { news: null });
});

app.get('/admin/news/edit/:id', (req, res) => {
  const news = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);
  if (!news) return res.status(404).send('ニュースが見つかりません');
  res.render('admin_news_form', { news });
});

app.post('/admin/news/save', (req, res) => {
  const { id, title, body, date } = req.body;
  if (id) {
    db.prepare('UPDATE news SET title = ?, body = ?, date = ? WHERE id = ?').run(title, body, date, id);
  } else {
    db.prepare('INSERT INTO news (title, body, date) VALUES (?, ?, ?)').run(title, body, date);
  }
  res.redirect('/admin/news');
});

app.post('/admin/news/delete/:id', (req, res) => {
  db.prepare('DELETE FROM news WHERE id = ?').run(req.params.id);
  res.redirect('/admin/news');
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} で起動中`);
});