const mongo = require('./mongo');
const config = require('./config');
const categoryAPI = require('../category');
const answerAPI = require('../answer');

/**
 * 
 * @typedef {object} CheckOptions
 * @prop {boolean} throw
 * @prop {string} name
 * @prop {('parameter'|'property'|'')} type 
 * @param {mongo.Question} question 
 * @param {CheckOptions} options 
 */
async function check(question, options) {
  let valid = typeof question === 'object'
  && question !== null
  && question instanceof mongo.model;

  if(typeof options === 'object' && options !== null) {
    if(!valid && options.throw) {
      throw new TypeError(
        `${options.type} '${options.name}' is null or not an instance of the question model`);
    }
  }

  return valid;
}

module.exports.check = check;

/**
 * gets a question with a certain id
 * @typedef {Object} GetOptions
 * @prop {number} maxAnswers
 * @param {string} id
 * @param {GetOptions} options
 * @returns {mongo.Question} 
 */
async function get(id) {
  let q = mongo.model.findById(String(id));
  q.populate('answers');
  q.populate('category');

  return await q.exec();
}

module.exports.get = get;

/**
 * limits the answers
 * @param {mongo.Question} question 
 * @param {number} amount 
 */
function limitAnswers(question, amount) {
  let maxAnswers = amount || config.maxAnswers;

  if(typeof options === 'object' && options !== null) {
    if(typeof options.maxAnswers === 'number')
      maxAnswers = options.maxAnswers;
  }

  if(maxAnswers > 1) {
    if(question.answers.length > maxAnswers) {
      let selectedAnswers = [];
      let correctAnswers = question.answers
      .filter(answ => answ.correct);
  
      for(let i = 0; i < Math.trunc(Math.random() * maxAnswers); i++) {
        let index = Math.trunc(Math.random() * correctAnswers.length);
        let answ = correctAnswers[index];
        selectedAnswers.push(answ);
        correctAnswers.splice(index, 1);
      }
  
      if(selectedAnswers.length < maxAnswers) {
        let restAmount = maxAnswers - selectedAnswers.length;

        let wrongAnswers = question.answers
        .filter(answ => !answ.correct);

        for(let i = 0; i < restAmount; i++) {
          let index = Math.trunc(Math.random() * wrongAnswers.length);
          let answ = wrongAnswers[index];
          selectedAnswers.push(answ);
          correctAnswers.splice(index, 1);
        }
      }
      question.selectedAnswers = selectedAnswers;
    }
  };

  return question;
}

module.exports.limitAnswers = limitAnswers;

/**
 * creates a new question
 * @param {string} text
 */
async function create(text) {
  if(typeof text !== 'string')
    throw new TypeError('required parameter \'text\' is not a string');

  let createdQuestion = await mongo.model.create({
    text: question.text
  });

  return createdQuestion;
}
module.exports.create = create;

/**
 * sets the category
 * @param {mongo.Question|mongo.model} question 
 * @param {categoryAPI.mongo.Category} category 
 */
async function setCategory(question, category) {
  check(question, {throw: true, name: 'question', type: 'parameter'});
  categoryAPI.core.check(category, {throw: true, name: 'category', type: 'parameter'});

  question.category = category._id;

  question = await question.save();

  return await get(question._id);
}

module.exports.setCategory = setCategory;

/**
 * adds answers to the question
 * @param {mongo.Question|mongo.model} question 
 * @param  {...answerAPI.mongo.Question} answers
 */
async function addAnswer(question, ...answers) {
  question.answers = question.answers.map(answer => {
    if(typeof answer === 'object'
    && answer !== null
    && answer._id)
      return answer._id
    else return answer;
  });

  check(question, {throw: true, name: 'question', type: 'parameter'});
  answers = answers
  .filter(answer => answerAPI.core.check(answer))
  .map(answer => mongo.mongoose.Types.ObjectId(String(answer._id)));

  question.answers.push(answers);
  question.answers = Array.from(new Set(question.answers.map(a => {
    if(typeof a === 'object' && a !== null) {
      if(typeof a._id !== 'undefined') {
        return String(a._id);
      } else {
        return String(a);
      }
    }
  })));

  question = await question.save();
  return await get(question._id);
}

module.exports.addAnswer = addAnswer;

/**
 * updates a question
 * @param {mongo.Question|mongo.model} question 
 * @param {mongo.Question} obj 
 */
async function update(question, obj) {
  check(question, {throw: true, name: 'question', type: 'parameter'});
  if(typeof obj !== 'object' || obj === null)
    throw new TypeError('\'obj\' is null or not an object');

  Object.keys(question).forEach(key => {
    if(typeof obj[key] !== 'undefined') question[key] = obj[key];
  })

  return await question.save();
}

module.exports.update = update;