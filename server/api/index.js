const express = require('express');
const questionAPI = require('./question');
const categoryAPI = require('./category');
const answerAPI = require('./answer');

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
    console.log(`setting routes for ${item.name}`)
    Object.entries(item.handler).forEach(entry => {
      if(typeof entry[1] === 'function') {
        let segments = entry[0].split(' ');
        let method = segments.shift();
        let path = String(segments.join(' '));
        console.log(`setting handler '${method}' on '${path}'`)
        switch(method.toUpperCase()) {
          case 'GET':
            app.get(path, entry[1]);
            break;
          case 'POST':
            app.post(path, entry[1]);
            break;
          case 'PUT':
            app.put(path, entry[1]);
            break;
          case 'DELETE':
            app.delete(path, entry[1]);
            break;
          case 'OPTIONS':
            app.options(path, entry[1]);
            break;
        }
      }
    });
  });

  console.log(app._router.stack);
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
  })
}

module.exports.use = use;
