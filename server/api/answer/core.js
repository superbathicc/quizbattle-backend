const mongo = require('./mongo');

/**
 * @typedef {object} CheckOptions
 * @prop {boolean} throw
 * @prop {string} name
 * @prop {('parameter'|'property'|'')} type
 * @param {mongo.Answer} answer 
 * @param {CheckOptions} options
 */
async function check(answer, options) {
  let valid = typeof answer === 'object'
  && answer !== null
  && answer instanceof mongo.model;

  if(typeof options === 'object' && options !== null) {
    if(!valid && options.throw) {
      throw new TypeError(
        `${options.type} '${options.name}' is null or not an instance of the answer model`);
    }
  }

  return valid;
}

module.exports.check = check;

/**
 * gets an answer by its id
 * @param {string} id 
 * @returns {Promise.<mongo.Answer>}
 */
async function get(id) {
  let q = mongo.model.findById(String(id));
  return await q.exec();
}

module.exports.get = get;

/**
 * creates a new answer
 * @param {string} text 
 * @param {boolean} correct 
 */
async function create(text, correct) {
  return await mongo.model.create({
    text,
    correct
  });
}

module.exports.create = create;

/**
 * creates or gets an answer
 * @param {mongo.Answer|string} answer 
 * `object` -> create\
 * `string` -> get by id
 * @returns {Promise<mongo.Answer>}
 */
async function createOrGet (answer) {
  if(typeof answer === 'object'
  && typeof answer.text === 'string'
  && typeof answer.correct === 'boolean') {
    return await create(answer.text, answer.correct);
  } else if(typeof answer === 'string') {
    return await get(answer);
  } else throw new TypeError('\'answer\' is not a string or an object');
}

module.exports.createOrGet = createOrGet;