const core = require('./core');
const amw = require('../../../lib/async-middleware');

module.exports['GET /categories'] = amw(async (req, res) => {
  let searchTerm;
  if(typeof req.query === 'object' && req.query !== null) {
    searchTerm = req.query.search
  }

  let categories = await core.search(searchTerm);

  res
  .status(200)
  .jsonp(categories);
});