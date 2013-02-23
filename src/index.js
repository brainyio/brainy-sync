if (typeof define !== 'function') { var define = require('amdefine')(module); }

define([
  'mongodb',
  'underscore',
  './collection',
  './model'
], function(mongodb, _, cSync, mSync) {

  var Server = mongodb.Server,
    Db = mongodb.Db;

  return function(config) {
    var host = config.host,
      port = config.port,
      name = config.name,
      connection = new Server(host, port);
    
    var client = new Db(name, connection, {
      w: 1
    });

    client.open(function(err, client) { });
    
    return function(method, resource, options) {
      var is_collection = resource.models,
        name = resource.urlRoot || resource.url,
        sync = is_collection? cSync: mSync,
        attrs = options.data || resource.toJSON(options);

      var success = options.success;
      options.success = function(resp) {
        if (success) success(resource, resp, options);
        resource.trigger('sync', resource, resp, options);
      };

      var error = options.error;
      options.error = function(status) {
        if (error) error(resource, status, options);
        resource.trigger('error', resource, status, options);
      };
    
      var params = { 
        capped: true,
        size: 100000
      };

      (function(name, params, attrs, options) {
        client.createCollection(name, params, function(err, collection) {
          sync[method](collection, attrs, options);
        });
      })(name, params, attrs, options);
      
      resource.trigger('request', resource, null, options);
    };
  }

});