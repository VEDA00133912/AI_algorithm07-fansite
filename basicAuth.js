require('dotenv').config();

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('認証が必要です');
  }

  const base64Credentials = auth.split(' ')[1];
  if (!base64Credentials) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('不正な認証情報です');
  }

  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    return next();
  } else {
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('認証情報が正しくありません');
  }
};