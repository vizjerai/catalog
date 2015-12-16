var express = require('express');
var app = express();
var config = require('../config/config.js');

module.exports = config[app.get('env')];
