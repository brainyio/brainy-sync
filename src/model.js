if (typeof define !== 'function') { var define = require('amdefine')(module); }

define([
  'mongodb'
], function(mongodb) {

  var Sync = function() {
  };

  Sync.prototype.create = function(collection, attrs, options) {
    collection.insert(attrs, function(err, docs) {
      if (err) {
        options.error(db);
      } else {
        options.success(docs[0]);
      }
      db.close();
    });
  };

  Sync.prototype.read = function(collection, attrs, options) {
    try {
      var _id = attrs._id;
      var data = {
        _id: new mongodb.ObjectID(_id)
      };
      collection.findOne(data, function(err, doc) {
        if (err) {
          options.error(db);
        } else {
          options.success(doc);
        }
        db.close();
      });
    } catch (e) {
      options.error();
    }
  };

  return new Sync;

});