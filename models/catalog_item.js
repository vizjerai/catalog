var Base = require('./base');

var CatalogItem = Base.Model.extend({
  hasTimestamps: true,
  tableName: 'catalog_items'
});
module.exports.Model = CatalogItem;

var CatalogItems = Base.Collection.extend({
  model: CatalogItem
});
module.exports.Collection = CatalogItems;
