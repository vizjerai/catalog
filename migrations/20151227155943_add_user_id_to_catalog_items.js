
exports.up = function(knex, Promise) {
  return knex.schema.table('catalog_items', function(table) {
    table.integer('user_id').index();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('catalog_items', function(table) {
    table.dropColumn('user_id');
  });
  
};
