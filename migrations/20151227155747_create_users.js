
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('users', function(table) {
    table.increments();
    table.string('name');
    table.string('email');
    table.string('google_id');
    table.timestamps();
  });
  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
