if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(function() {

  var Sync = function() {
  };

  Sync.prototype.read = function(db, name, attrs, options) {
    db.open(function(err, db) {
      db.collection(name, function(err, collection) {
        collection.find().toArray(function(err, docs) {
          if (err) {
            options.error(db);
          } else {
            options.success(docs);
          }
          db.close();
        });
      });
    });
  };

  return new Sync;

});