const dbConfig = require('./knexfile.js');
var knex = require('knex')(dbConfig);
exports.start = function() {
  return knex('svg_images')
    .select()
    .limit(1)
    .then(image => console.log(image))
    .catch(err => console.log(err));
};
