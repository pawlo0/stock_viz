/* global Stocks */

Meteor.subscribe("stocks");


////////////////////////////
///// helper functions for the vis control form
////////////////////////////

Template.stock_viz_controls.helpers({
    
    // returns an array of the names of all features of the requested type
    "get_fundamental_names": function(){
        // pull an example from the database
        // - we'll use this to find the names of all features
        var stock = Stocks.findOne();
        if (stock){
            var feat_list = [];
            for ( var f in stock.fundamentals) {
                feat_list.push({name: f});
            }
        }
        return feat_list;
    },
});


////////////////////////////
///// helper functions for the stocks fundamentals list display template
////////////////////////////

Template.stock_fundamentals_list.helpers({
    "get_fundamental_values":function(){
        if (Session.get("study") == undefined){
            Session.set("study", $(".js-select-single-fundamental :selected").val());
        }
        var stocks = Stocks.find();
        var list = [];
        // build an array of data on the fly for the 
        // template consisting of 'feature' objects
        // describing the song and the value it has for this particular feature
        stocks.forEach(function(stock){
            list.push({
                symbol: stock["Ticker symbol"],
                name: stock["Company name"],
                value: Math.round(stock.fundamentals[Session.get("study")]* 100) / 100
            });
        });
        return list;
    },
    "study":function(){
        if (Session.get("study") == undefined){
            Session.set("study", $(".js-select-single-fundamental :selected").val());
        }
        return Session.get("study");
    }
});

////////////////////////////
///// event handlers for the viz controls form
////////////////////////////

Template.stock_viz_controls.events({
    // event handler for when user changes the selected
    // option in the drop down list
    "change .js-select-single-fundamental":function(event){
        Session.set("study", event.target.value);
        event.preventDefault();
    }
}); 
