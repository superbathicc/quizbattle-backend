const config = require('./config');
const core = require('./core');
const fs = require('fs');

module.exports = (async () => {
  try {
    if(!fs.existsSync(config.path)) {
      await core.cloneRepository(config.repository, {
        target: config.path
      });
    } else {
      await core.pullRepository(config.path);
    }
  } catch(err) {
    console.error('something failed in initializing the client.', err);
  }
});