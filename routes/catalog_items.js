var express = require('express');
var router = express.Router();
var CatalogItems = require('../models/catalog_item').Collection;
var CatalogItem = require('../models/catalog_item').Model;

router.route('/')
  .get(function(req, res, next) {
    CatalogItems.forge().fetch().then(function(collection) {
      res.json({collection: collection});
    }).catch(next);
  })
  .post(function(req, res, next) {
    var data = {
      product_name: req.body.product_name,
      store_name: req.body.store_name,
      image_url: req.body.image_url,
      barcode: req.body.barcode
    };

    CatalogItem.forge().save(data)
      .then(function() {
        res.redirect('/');
      }).catch(next);
  });
router.route('/:id')
  .delete(function(req, res, next) {
    CatalogItem.forge({id: req.params.id}).destroy().then(function(model) {
      res.redirect('/');
    });
  });

module.exports = router;
