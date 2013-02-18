if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(function() {

  var Sync = function() {
  };

  Sync.prototype.read = function(collection, attrs, options) {
    collection.find(options.data).toArray(function(err, docs) {
      if (err) {
        options.error();
      } else {
        options.success(docs);
      }
    });
  };

  return new Sync;

});