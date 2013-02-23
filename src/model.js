if (typeof define !== 'function') { var define = require('amdefine')(module); }

define([
  'mongodb'
], function(mongodb) {

  var Sync = function() {
  };

  Sync.prototype.create = function(collection, attrs, options) {
    collection.insert(attrs, function(err, docs) {
      if (err) {
        options.error();
      } else {
        options.success(docs[0]);
      }
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
          options.error();
        } else {
          options.success(doc);
        }
      });
    } catch (e) {
      options.error();
    }
  };

  Sync.prototype.update = function(collection, attrs, options) {
    try {
      var _id = attrs._id;
      var data = {
        _id: new mongodb.ObjectID(_id)
      };
      delete attrs._id;
      console.log(data, attrs)
      collection.update(data, { $set: attrs }, function(err, doc) {
        if (err) {
          options.error(err.err);
        } else {
          options.success(doc);
        }
      });
    } catch (e) {
      options.error();
    }
  };

  Sync.prototype.delete = function(collection, attrs, options) {
    try {
      var _id = attrs._id;
      var data = {
        _id: new mongodb.ObjectID(_id)
      };
      collection.remove(data, function(err) {
        if (err) {
          options.error(err.err);
        } else {
          options.success(200);
        }
      });
    } catch (e) {
      options.error();
    }
  };

  return new Sync;

});