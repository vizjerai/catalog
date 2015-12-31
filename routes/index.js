var express = require('express');
var router = express.Router();
var CatalogItems = require('../models/catalog_item').Collection;
var CatalogItem = require('../models/catalog_item').Model;
var ApiSearchUpc = require('../models/api_search_upc');
var ensureAuthenticated = require('../lib/ensure_authenticated');

router.route('/')
  .all(ensureAuthenticated)
  .get(function(req, res, next) {
    var data = {title: 'Catalog', form: req.query};

    var query = {
      where: {user_id: req.user.get('id')},
      orderBy: ['product_name','asc']
    };

    CatalogItems.forge().query(query).fetch().then(function(collection) {
      data.collection = collection;
      res.render('index', data);
    }).catch(next);
  })
  .post(function(req, res, next) {
    var data = {title: 'Catalog', form: req.body};
    var query = {
      where: {user_id: req.user.get('id')},
      orderBy: ['product_name','asc']
    };

    ApiSearchUpc.findAll(data.form.barcode)
      .then(function(body) {
        data.body = body;
        return CatalogItems.forge().query(query).fetch();
      }).then(function(collection) {
        data.collection = collection;
        res.render('index', data);
      }).catch(next);
  });

module.exports = router;
