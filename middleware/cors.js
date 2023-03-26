const allowedOrigins = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'http://localhost:3001',
  'http://localhost:3000',
  'https://mesto.sergejj.nomoredomainsclub.ru',
  'http://mesto.sergejj.nomoredomainsclub.ru',
  'https://movies.sergejj.nomoredomains.work',
];

function checkSource(req, res, next) {
  const { method } = req;
  const { origin } = req.headers;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requetsHeaders = req.headers['access-control-request-headers'];
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requetsHeaders);
    return res.end();
  }
  return next();
}
module.exports = {
  checkSource,
};
