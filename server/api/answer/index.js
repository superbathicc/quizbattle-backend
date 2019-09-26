const config = require('./config');
const core = require('./core');
const mongo = require('./mongo');
const handler = require('./handler');

module.exports = {
  config,
  core,
  handler,
  mongo
};