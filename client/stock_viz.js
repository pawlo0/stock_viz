/* global Stocks */

Meteor.subscribe("stocks");


////////////////////////////
///// helper functions for the vis control form
////////////////////////////

Template.stock_viz_controls.helpers({
    
    // returns an array of the names of all features of the requested type
    get_feature_names: function(){
        // pull an example from the database
        // - we'll use this to find the names of all features
        var stock = Stocks.findOne();
        if (stock){
            var feat_list = [];
            for ( var f in stock.fundamentals) {
                feat_list.push({name: f});
            }
        }
        console.log(feat_list);
        return feat_list;
    },
});
