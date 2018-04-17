const dbConfig = require('./knexfile.js');
var knex = require('knex')(dbConfig);
exports.start = function start() {
  console.log('API database connection start');
  return knex('image_references')
    .select()
    .limit(1)
    .then(image => console.log('Image successfully found'))
    .catch(err => {
      // 42P01 means does not exist
      if (err.code === '42P01') {
        // This might also be a spot to trigger *all* migrations
        // return knex.schema.createTable('svg_images', function(table) {
        //   table.uuid('image_id');
        //   table.text('image');
        //   table.string('name');
        //   table.timestamps();
        // });
      }
      console.log(err);
    });
};
exports.addImage = function addImage(imageObject) {
  const { id, name } = imageObject;
  imageObject.filetype = 'svg';
  imageObject.created_at = knex.fn.now();
  imageObject.updated_at = knex.fn.now();
  return knex('image_references')
    .insert(imageObject)
    .then(results => {})
    .catch(err => {
      console.log(err);
    });
};
exports.getImageData = function getImage(imageID) {
  var getQuery = knex
    .select('*')
    .from('image_references')
    .where('id', '=', imageID);
  console.log('\n\n' + getQuery.toString() + '\n\n');
  return getQuery;
};
exports.getAllImages = function getAllImages() {
  var getAll = knex
    .select({ image_id: 'id', name: 'name' })
    .from('image_references');
  return getAll;
};
