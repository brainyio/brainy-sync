if (typeof define !== 'function') { var define = require('amdefine')(module); }

define([
  'underscore'
], function(_) {

  var Sync = function() {
  };

  Sync.prototype.read = function(collection, attrs, options) {
    // for some reason req.query can look like this:
    // [ text: { $regex: 'foo' } ] instead of
    // { text: { $regex: 'foo' } }. clone does not work on the object
    // but this simple loop does. no idea what's going on here.
    var query = {};
    for (var i in attrs) {
      query[i] = attrs[i];
    }
    collection.find(query).toArray(function(err, docs) {
      if (err) {
        options.error();
      } else {
        options.success(docs);
      }
    });
  };

  return new Sync;

});