const path = require('path');
const fs = require('fs');
const amw = require('../../../lib/async-middleware');
const mime = require('mime');

module.exports['GET /'] = (req, res) => {
  res
  .status(200)
  .sendFile(path.join(__dirname, './src/public/index.html'))
};

module.exports['GET /assets/*'] = (req, res) => {
  let p = path.join(__dirname, './src/assets/', path.relative('/assets', req.path));
  if(fs.existsSync(p) && fs.statSync(p).isFile()) {
    res
    .status(200)
    .header('content-type', mime.getType(p))
    .send(fs.readFileSync(p));
  } else res.sendStatus(404);
};