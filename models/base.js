var config = require('../lib/config');
var knex = require('knex')(config.database);
var bookshelf = require('bookshelf')(knex);

module.exports.Model = bookshelf.Model.extend({});
module.exports.Collection = bookshelf.Collection.extend({});
