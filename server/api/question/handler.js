const express = require('express');
const core = require('./core');
const amw = require('../../lib/async-middleware');

/**
 * 
 * @param {express.Application} app 
 */
function getById(app) {
  app.get('/question/:questionId', async (req, res) => {
    let maxAnswers = -1;
    if(typeof req.query === 'object' && req.query !== null) {
      if(req.query.maxAnswers)
        maxAnswers = Number(req.query.maxAnswers);
    }

    let question = await core.get(req.params.questionId, {
      maxAnswers
    });

    res
    .status(200)
    .jsonp(question);
  });
}