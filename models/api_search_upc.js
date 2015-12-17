var Promise = require('bluebird');
var config = require('../lib/config.js');
var request = require('request');

var ApiSearchUpc = {
  findAll: function(barcode) {
    var request_options = {
      url: config.searchupc.api,
      method: 'GET',
      json: true,
      formData: {
        request_type: 3,
        access_token: config.searchupc.access_token,
        upc: barcode
      }
    };

    return new Promise(function(resolve, reject) {
      request(request_options, function(err, res, body) {
        if (err) {
          return reject(err);
        }
        if (res.statusCode == 200) {
          // TODO: reject if body is not JSON, invalid access_token will do this.
          return resolve(body);
        }
        var error = new Error(body);
        return reject(error);
      });
    });
  }
};

module.exports = ApiSearchUpc;
