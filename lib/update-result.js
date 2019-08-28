const monogoose = require('mongoose');

class UpdateResult {
  /**
   * creates a new instance of UpdateResult
   * @typedef {object} UpdateResultProps
   * @prop {boolean} acknowledged
   * @prop {number} matchedCount
   * @prop {number} modifiedCount
   * @typedef {object} ConstructorProperties
   * @prop {UpdateResultProps} result
   * @prop {*} before
   * @prop {*} after
   * @prop {*} query
   * @prop {*} update
   * @param {ConstructorProperties} properties 
   */
  constructor(properties) {
    if(typeof properties !== 'object'
    || properties === null)
      throw new TypeError('\'properties\' is null or not an object');
  }
}

module.exports = UpdateResult;