const core = require('./core');
const amw = require('../../../lib/async-middleware');
const answerAPI = require('../answer');
const categoryAPI = require('../category');

module.exports['POST /question'] = amw(async (req, res) => {
  let question = await core.create(req.body['text']);

  res
  .status(201)
  .jsonp(question);
});

module.exports['GET /question/:questionId'] = amw(async (req, res) => {
  let question = await core.get(req.params.questionId);

  if(typeof req.query === 'object' && req.query !== null) {
    if(req.query['answers']) {
      question = core.limitAnswers(question, Number(req.query['answers']));
    }
  }

  res
  .status(200)
  .jsonp(question);
});

module.exports['PUT /question/:questionId'] = amw(async (req, res) => {
  let question = await core.get(req.params['questionId'], req.body);
  
  question = await core.update(question, req.body);

  res
  .status(200)
  .jsonp(question);
})

module.exports['POST /question/:questionId/category'] = amw(async (req, res) => {
  let question = await core.get(req.params['questionId']);

  let category = await categoryAPI.core.createOrGet(req.body);

  question = await core.setCategory(question, category)

  res
  .status(200)
  .jsonp(question);
});

module.exports['POST /question/:questionId/answer'] = amw(async (req, res) => {
  let question = await core.get(req.params['questionId'], req.body);

  let answers;
  if(Array.isArray(req.body)) {
    answers = await Promise.all(answers.map(answer => Promise.resolve(answerAPI.core.createOrGet(answer))));
  } else if(typeof req.body !== undefined) {
    await answerAPI.core.createOrGet(req.body)
  }

  question = await core.addAnswer(question, ...answers);

  res
  .status(200)
  .jsonp(question)
});

module.exports