if (typeof define !== 'function') { var define = require('amdefine')(module); }

define([
  'underscore',
  './collection',
  './model'
], function(_, cSync, mSync) {

  var Server = mongodb.Server,
    Db = mongodb.Db;

  return function(config) {
    var host = config.host,
      port = config.port,
      name = config.name,
      connection = new Server(host, port);
    
    var db = new Db(name, connection, {
      w: 1
    });

    return function(method, model, options) {
      var is_collection = model.models,
        collection_name = _.result(model, 'url')
        sync = is_collection? cSync: mSync,
        attrs = options.attrs || model.toJSON(options);

      var success = options.success;
      options.success = function(resp) {
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };

      var error = options.error;
      options.error = function(status) {
        if (error) error(model, status, options);
        model.trigger('error', model, status, options);
      };
      
      sync[method](db, collection_name, attrs, options);
      model.trigger('request', model, null, options);
    };
  }

});