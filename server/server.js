/* global Stocks */

Meteor.publish("stocks", function () {
  return Stocks.find();
});