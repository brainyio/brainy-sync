if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(function() {

  return function(adapter_name, config) {
    var adapter = require('./' + adapter_name + '/index');
    return adapter(config);
  };

});