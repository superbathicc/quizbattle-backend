const mongoose = require('mongoose');
const answerAPI = require('../answer');
const categoryAPI = require('../category');

/**
 * @typedef {object} Question
 * @prop {string} text
 * @prop {categoryAPI.mongo.Category} category
 * @prop {Array.<answerAPI.mongo.Answer>} answers
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
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: answerAPI.mongo.model.modelName
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: categoryAPI.mongo.model.modelName
  },
  time: {
    type: Number,
    default: 10000
  },
  data: {
    type: String
  },
  dataType: {
    type: String
  },
  dataEncoding: {
    type: String
  },
  dataName: {
    type: String
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
});

module.exports.mongoose = mongoose;
module.exports.schema = schema;
module.exports.model = mongoose.model('question', schema);