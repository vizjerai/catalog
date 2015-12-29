var Base = require('./base');

var User = Base.Model.extend({
  hasTimestamps: true,
  tableName: 'users'
});
module.exports.Model = User;

var Users = Base.Collection.extend({
  model: User
});

module.exports.Collection = Users;
