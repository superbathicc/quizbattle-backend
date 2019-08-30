const config = require('./config');
const fs = require('fs');
const path = require('path');

module.exports['GET /'] = (req, res) => {
  let p = path.join(config.path, config.index);
  if(fs.existsSync(p)) {
    res
    .status(200)
    .sendFile(p);
  } else res.sendStatus(404);
}

module.exports['GET /assets/*'] = (req, res) => {
  let p = path.join(config.path, config.assets, path.relative('/assets/', req.path));
  if(fs.existsSync(p)) {
    res
    .status(200)
    .sendFile(p);
  } else res.sendStatus(404);
}