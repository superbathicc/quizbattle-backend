const express = require('express');
/**
 * @param {(
 * req: express.Request,
 * res: express.Response,
 * next: () => void
 * ) => void} fn
 */
function amw(fn) {
  Promise.resolve(fn).then(() => {
    next();
  }).catch(err => {
    next(err);
  })
}

module.exports = amw;