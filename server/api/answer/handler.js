// eslint-disable-next-line no-unused-vars
const express = require('express');
const core = require('./core');
const amw = require('../../../lib/async-middleware');

module.exports['POST /answer'] = amw(async (req, res) => {
  if(typeof req.body !== 'object' || req.body === null)
    throw new TypeError('\'req.body\' is null or not an object');

  let answer = await core.create(req.body.text, req.body.correct);

  res
    .status(200)
    .jsonp(answer);
});

module.exports['GET /answer/:answerId'] = amw(async (req, res) => {
  let answer = await core.get(req.params['answerId']);

  res
    .status(200)
    .jsonp(answer);
});
