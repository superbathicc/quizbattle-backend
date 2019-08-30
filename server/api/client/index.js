const config = require('./config');
const handler = require('./handler');
const init = require('./init');

init().then((...args) => {
  console.log('client repository done', ...args);
}).catch(err => {
  console.error(err);
})

module.exports = {
  config,
  handler,
  init
}