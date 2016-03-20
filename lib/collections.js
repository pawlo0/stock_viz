var fs = Npm.require('fs');
var path = Npm.require('path');
var basepath = path.resolve('.').split('.meteor')[0];

Files = new FS.Collection("files", {
  stores: [new FS.Store.FileSystem("files", {path: basepath+"uploads"})]
});