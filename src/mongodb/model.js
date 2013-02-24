if (typeof define !== 'function') { var define = require('amdefine')(module); }

define([
  'mongodb'
], function(mongodb) {

  var Sync = function() {
  };

  Sync.prototype.create = function(collection, attrs, options) {
    collection.insert(attrs, function(err, docs) {
      if (err) {
        options.error(err.err);
      } else if (!docs[0]) {
        options.error(404);
      } else {
        options.success(docs[0]);
      }
    });
  };

  Sync.prototype.read = function(collection, attrs, options) {
    try {
      var _id = attrs._id;
      attrs._id = new mongodb.ObjectID(_id);

      // since models can have undefined defaults
      // we don't want to include those in the query.
      // use `null` to search for empty keys
      for (var i in attrs) {
        if (attrs[i] === undefined) {
          delete attrs[i];
        }
      };

      collection.findOne(attrs, function(err, doc) {
        if (err) {
          options.error(err.err);
        } else if (!doc) {
          options.error(404);
        } else {
          options.success(doc);
        }
      });
    } catch (e) {
      options.error();
    }
  };

  Sync.prototype.patch = function(collection, attrs, options) {
    try {
      var _id = attrs._id;
      var data = {
        _id: new mongodb.ObjectID(_id)
      };
      delete attrs._id;

      // since models can have undefined defaults
      // we don't want to include those in the query.
      // use `null` to set empty key
      for (var i in attrs) {
        if (attrs[i] === undefined) {
          delete attrs[i];
        }
      };

      collection.findAndModify(data, [['_id','asc']], { $set: attrs }, { 'new': true },
        function(err, doc) {
          if (err) {
            options.error(err.err);
          } else if (!doc) {
            options.error(404);
          } else {
            options.success(doc);
          }
        });
    } catch (e) {
      options.error();
    }
  };

  Sync.prototype.update = Sync.prototype.patch;

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