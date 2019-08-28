const mongoose = require('mongoose');

/**
 * @typedef {Object} Answer
 * @prop {string} text
 * @prop {boolean} correct
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
  correct: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
});

module.exports.mongoose = mongoose;
module.exports.schema = schema;
module.exports.model = mongoose.model('answer', schema);