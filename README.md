# brainy-sync

brainy-sync let's you use native Backbone models and their `fetch` and `save` API on the server by overriding `Backbone.sync` to read and write from MongoDB. this is useful for writing server code with Backbone models, or sharing your client models with the server.

## install

```
$ npm install brainy-sync
```

## use 

simply override Backbone's sync method with brainy-sync methods. brainy-sync accepts a config to describe the MongoDB connection, and returns a sync function. true to Backbone, you can override sync at the global level (Backbone), class level (Model or Collection), or instance level. thereon, all collection and model `fetch` or `save` methods on the server will use MongoDB instead of AJAX.

```
var Backbone = require('backbone'),
  Sync = require('brainy-sync');

Backbone.sync = Sync({
  host: '127.0.0.1',
  port: 27017,
  name: 'birdlog'
});
```

brainy-sync requires that your model and collection definitions include a `urlRoot`, `url`, or `url()` property. while on the client this is used to evaluate the REST endpoint, brainy-sync uses this to infer a database collection name. additionally, you likely want to assign `_id` to your model's `idAttribute` to properly reflect MongoDB records.

that all considered, the Backbone API remains unchanged:

```
var Message = Backbone.Model.extend({
  urlRoot: '/messages',
  idAttribute: '_id'
});

var message = new Message;
message.save({ text: 'foo' }, {
  success: function() {
    console.log('saved record to /messages collection');
  }
});
```

**important**: using Node's default `require`, you cannot manipulate the original Backbone instance at a global level. that is, modifying Backbone.sync in one file will not be reflected in another file. this means you must override sync() wherever Backbone is loaded from, which requires you also have a configuration reference in all those places. this is obviously not ideal. my interim solution has been using RequireJS on the server, which allows you to modify loaded modules. consequently, overriding Backbone.sync once is reflected in all instances.