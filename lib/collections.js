Stocks = new Mongo.Collection("stocks");

Files = new FS.Collection("files", {
  stores: [new FS.Store.GridFS("files")]
});