const config = require('./config');
const core = require('./core');
const fs = require('fs');

module.exports = (async () => {
  if(!fs.existsSync(config.path)) {
    await core.cloneRepository(config.repository, {
      target: config.path
    });
  } else {
    await core.pullRepository(config.path);
  }
});