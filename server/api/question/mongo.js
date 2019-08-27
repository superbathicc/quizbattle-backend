const mongoose = require('mongoose');
const answer = require('../answer');
const category = require('../category');

/**
 * @typedef {Object} Question
 * @prop {string} text
 * @prop {Array.<answer.mongo.Answer>} answers
 * @prop {Date} created
 * @prop {Date} updated
 * @prop {mongoose.Types.ObjectId} _id
 * @prop {string} __v
 */

let schema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  answers: {
    type: mongoose.Schema.Types.ObjectId,
    ref: answer.mongo.model.modelName
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: category.mongo.model.modelName
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
});

module.exports.schema = schema;
module.exports.model = mongoose.model('question', schema)