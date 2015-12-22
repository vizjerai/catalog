var express = require('express');
var router = express.Router();
var CatalogItems = require('../models/catalog_item').Collection;
var ApiSearchUpc = require('../models/api_search_upc');
var ensureAuthenticated = require('../lib/ensure_authenticated');

router.route('/')
  .all(ensureAuthenticated)
  .get(function(req, res, next) {
    var data = {title: 'Catalog', form: req.query};

    CatalogItems.forge().fetch().then(function(collection) {
      data.collection = collection;
      res.render('index', data);
    }).catch(next);
  })
  .post(function(req, res, next) {
    var data = {title: 'Catalog', form: req.body};

    ApiSearchUpc.findAll(data.form.barcode)
      .then(function(body) {
        data.body = body;
        return CatalogItems.forge().fetch();
      }).then(function(collection) {
        data.collection = collection;
        res.render('index', data);
      }).catch(next);
  });

module.exports = router;
