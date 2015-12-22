
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('catalog_items', function(table) {
    table.increments();
    table.string('product_name');
    table.string('store_name');
    table.string('image_url');
    table.string('barcode').index();
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('catalog_items');
};
