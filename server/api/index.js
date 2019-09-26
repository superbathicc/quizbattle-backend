// eslint-disable-next-line no-unused-vars
const express = require('express');
const questionAPI = require('./question');
const categoryAPI = require('./category');
const answerAPI = require('./answer');
const clientAPI = require('./client');

function prepareRouter(app, method, path, ...fn) {
  switch(method.toUpperCase()) {
  case 'GET':
    app.get(path, ...fn);
    break;
  case 'POST':
    app.post(path, ...fn);
    break;
  case 'PUT':
    app.put(path, ...fn);
    break;
  case 'DELETE':
    app.delete(path, ...fn);
    break;
  case 'OPTIONS':
    app.options(path, ...fn);
    break;
  }
}

/**
 *
 * @typedef {object} RouterItem
 * @prop {string} name
 * @prop {object} handler
 * @param {express.Application} app
 * @param  {...RouterItem} items
 */
function router(app, ...items) {
  items.forEach(item => {
    console.log(`setting routes for ${item.name}`);
    Object.entries(item.handler).forEach(entry => {
      let segments = entry[0].split(' ');
      let method = segments.shift();
      let path = String(segments.join(' '));
      console.log(`setting handler '${method}' on '${path}'`);
      if(typeof entry[1] === 'function') {
        prepareRouter(app, method, path, entry[1]);
      } else if(Array.isArray(entry[1])) {
        prepareRouter(app, method, path, ...entry[1]);
      }
    });
  });

  // console.log(app._router.stack);
}

/**
 * uses an express application, sets the routes
 * @param {express.Application} app
 */
function use(app) {
  router(app, {
    name: questionAPI.config.name,
    handler: questionAPI.handler
  }, {
    name: answerAPI.config.name,
    handler: answerAPI.handler
  }, {
    name: categoryAPI.config.name,
    handler: categoryAPI.handler
  }, {
    name: clientAPI.config.name,
    handler: clientAPI.handler
  });
}

module.exports.use = use;
