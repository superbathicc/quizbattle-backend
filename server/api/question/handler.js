const core = require('./core');
const amw = require('../../../lib/async-middleware');
const answerAPI = require('../answer');
const categoryAPI = require('../category');
const multer = require('multer');

module.exports['POST /question'] = amw(async (req, res) => {
  let question = await core.create(req.body['text']);

  res
  .status(201)
  .jsonp(question);
});

module.exports['GET /question'] = amw(async (req, res) => {
  let category;
  if(typeof req.query === 'object' && req.query !== null) {
    if(typeof req.query.category === 'string')
      category = await categoryAPI.core.get(req.query.category);
  }

  let question = await core.getRandom(category);

  res
  .status(200)
  .jsonp(question);
})

module.exports['GET /question/:questionId'] = amw(async (req, res) => {
  let question = await core.get(req.params.questionId);

  let result = question.toObject();

  if(typeof req.query === 'object' && req.query !== null) {
    if(req.query['answers']) {
      question = core.limitAnswers(question, Number(req.query['answers']));
      result.selected = question.selectedAnswers
    }
  }

  res
  .status(200)
  .jsonp(result);
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
    answers = await Promise.all(req.body.map(answer =>
      Promise.resolve(answerAPI.core.createOrGet(answer))));
  } else if(typeof req.body !== undefined) {
    answers = await answerAPI.core.createOrGet(req.body);
  }

  if(Array.isArray(answers)) {
    question = await core.addAnswer(question, ...answers);
  } else {
    question = await core.addAnswer(question, answers);
  }

  res
  .status(200)
  .jsonp(question)
});


let upload = new multer({
  dest: require('os').tmpdir(),
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 320000000
  }
});

module.exports['POST /question/:questionId/data'] = [
  upload.single('data'),
  amw(async (req, res) => {
    if(typeof req.file === 'object' && req.file !== null) {
      let question = await core.get(req.params.questionId);

      question = await core.data(question, req.file.originalname, req.file.mimetype, req.file.buffer, req.file.size)

      res
      .status(200)
      .jsonp(question);
    } 
  })]