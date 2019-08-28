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
        console.log('setting up')
      }
    });
  });
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
  })
}

module.exports.use = use;