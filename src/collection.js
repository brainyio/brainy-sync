if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(function() {

  var Sync = function() {
  };

  Sync.prototype.read = function(collection, attrs, options) {
    collection.find().toArray(function(err, docs) {
      if (err) {
        options.error(db);
      } else {
        options.success(docs);
      }
      db.close();
    });
  };

  return new Sync;

});