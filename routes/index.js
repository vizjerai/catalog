var express = require('express');
var router = express.Router();
var config = require('../lib/config.js');
var request = require('request');

router.route('/')
  .get(function(req, res, next) {
    var data = {title: 'Catalog', form: req.query};
    res.render('index', data);
  })
  .post(function(req, res, next) {
    var data = {title: 'Catalog', form: req.body};

    var request_options = {
      url: config.searchupc.api,
      method: 'GET',
      json: true,
      formData: {
        request_type: 3,
        access_token: config.searchupc.access_token,
        upc: data.form.barcode
      }
    };
    data.request_options = request_options;

    request(request_options, function(error, response, body) {
      if (error) {
        return next(error);
      }
      data.response = response;
      if (response.statusCode == 200) {
        data.body = body;
      }
      res.render('index', data);
    });
  });

module.exports = router;
