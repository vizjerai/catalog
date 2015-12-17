var express = require('express');
var router = express.Router();
var config = require('../lib/config.js');
var request = require('request');
var ApiSearchUpc = require('../models/api_search_upc');

router.route('/')
  .get(function(req, res, next) {
    var data = {title: 'Catalog', form: req.query};
    res.render('index', data);
  })
  .post(function(req, res, next) {
    var data = {title: 'Catalog', form: req.body};

    ApiSearchUpc.findAll(data.form.barcode)
      .then(function(body) {
        data.body = body;
        res.render('index', data);
      })
      .error(next);
  });

module.exports = router;
