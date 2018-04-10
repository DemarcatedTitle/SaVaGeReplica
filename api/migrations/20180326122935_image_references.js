exports.up = function(knex, Promise) {
  return knex.schema.createTable('image_references', function(table) {
    table.uuid('id');
    table.uuid('owner_id');
    table.string('name');
    table.string('filetype');
    table.string('type');
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('image_references');
};
