const mongo = require('./mongo');
// eslint-disable-next-line no-unused-vars
const config = require('./config');

/**
 * @typedef {object} CheckOptions
 * @prop {boolean} throw
 * @prop {string} name
 * @prop {('parameter'|'property'|'')} type
 * @param {mongo.Category} category
 * @param {CheckOptions} options
 */
async function check(category, options) {
  let valid = typeof category === 'object'
  && category !== null
  && category instanceof mongo.model;

  if(typeof options === 'object' && options !== null) {
    if(!valid && options.throw) {
      throw new TypeError(
        `${options.type} '${options.name}' is null or not an instance of the category model`);
    }
  }

  return valid;
}

module.exports.check = check;

/**
 * creates a new category
 * @param {string} name
 * @param {string} description
 */
async function create(name, description) {
  return await mongo.model.create({
    name,
    description
  });
}

module.exports.create = create;

async function get(id) {
  let q = mongo.model.findById(String(id));
  return await q.exec();
}

module.exports.get = get;

async function createOrGet(category) {
  if(typeof category === 'object' && category !== null) {
    if(typeof category.name === 'string') {
      return await create(category.name, category.description);
    } else if(typeof category.id === 'string') {
      return await get(category.id);
    }
  }
  throw new TypeError('\'category\' is not valid');
}

module.exports.createOrGet = createOrGet;

async function search(searchTerm) {
  let q = mongo.model.find();

  if(typeof searchTerm === 'string') {
    q.where('name', {$regex: searchTerm});
  }

  return await q.exec();
}

module.exports.search = search;