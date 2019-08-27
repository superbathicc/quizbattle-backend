const mongoose = require('mongoose');

/**
 * @typedef {Object} Category
 * @prop {string} name
 * @prop {string} description
 * @prop {Date} created
 * @prop {Date} updated
 * @prop {mongoose.Types.ObjectId} _id
 * @prop {string} __v
 */

let schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
});

module.exports.schema = schema;
module.exports.model = mongoose.model('category', schema);