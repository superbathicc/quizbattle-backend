const express = require('express');
/**
 * @param {(
 * req: express.Request,
 * res: express.Response,
 * next: () => void
 * ) => void} fn
 */
function amw(fn) {
  return function(req, res, next) {
    Promise.resolve(fn(req, res, next)).then(() => {
      next();
    }).catch(err => {
      next(err);
    })
  }
}

module.exports = amw;