// Update with your config settings.
var config = require('./lib/config');
var express = require('express');
var app = express();

var knex = {};
knex[app.get('env')] = config.database;
module.exports = knex;
