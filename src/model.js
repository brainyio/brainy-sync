if (typeof define !== 'function') { var define = require('amdefine')(module); }

define([
  'mongodb'
], function(mongodb) {

  var Sync = function() {
  };

  Sync.prototype.create = function(db, name, attrs, options) {
    db.open(function(err, db) {
      db.collection(name, function(err, collection) {
        collection.insert(attrs, function(err, docs) {
          if (err) {
            options.error(db);
          } else {
            options.success(docs[0]);
          }
          db.close();
        });
      });
    });
  };

  Sync.prototype.read = function(db, name, attrs, options) {
    try {
      var _id = attrs._id;
      var data = {
        _id: new mongodb.ObjectID(_id)
      };
      db.open(function(err, db) {
        db.collection(coll_name, function(err, collection) {
          collection.findOne(data, function(err, doc) {
            if (err) {
              options.error(db);
            } else {
              options.success(doc);
            }
            db.close();
          });
        });
      });
    } catch (e) {
      options.error();
    }
  };

  return new Sync;

});