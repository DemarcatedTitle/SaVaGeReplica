exports.up = function(knex, Promise) {
  knex.createTable('image_references', function(table) {
    table.uuid('id');
    table.string('name');
    table.string('filetype');
    table.uuid('owner_id');
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  knex.dropTable('image_references');
};
