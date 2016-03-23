/* global Stocks */

Meteor.subscribe("stocks");
var visjsobj;

////////////////////////////
///// helper functions for the vis control form
////////////////////////////

Template.stock_viz_controls.helpers({
    
    // returns an array of the names of all features of the requested type
    "get_fundamental_names": function(){
        
        // pull an example from the database
        // - we'll use this to find the names of all features
        var stock = Stocks.findOne();
        if (Session.get("study") == undefined){
            Session.set("study", Object.keys(stock.fundamentals)[0]);
        }
        
        if (stock){
            var feat_list = [], selected = "";
            for ( var f in stock.fundamentals) {
                if (Session.get("study") == f) {
                    selected = "selected";
                } else {
                    selected = "";
                }
                feat_list.push({name: f, isSelected: selected});
            }
        }
        return feat_list;
    },
    "get_groups": function(){
        if (Session.get("group") == undefined){
            Session.set("group", "Sector");
        }
        var groups = [
            {group: "Sector"},
            {group: "Industry"}
            ];
        return groups;
    }
});


////////////////////////////
///// helper functions for the stocks fundamentals list display template
////////////////////////////

Template.stock_fundamentals_list.helpers({
    "get_fundamental_values":function(){

        // Had to be careful not to pass values that are not numbers because sometimes we get values like "n/a"
        // If so, it would mess the data, so I decided to filter the data.
        // The way to do that was through filtering the mongo query to only retrieve double numbers (same as $type:1)
        // On top of that, we're searching in a nesting object, so I had to prepare a string.
        var search = 'fundamentals.'+ Session.get("study");
        var stocks = Stocks.find({
            [search]: {$type: 1}});
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
    },
    "change .js-select-grouping":function(event){
        Session.set("group", event.target.value);
        event.preventDefault();
    },
    // event handler for when the user clicks on the 
    // blobs button
     "click .js-show-blobs":function(event){
      initBlobVis();
      event.preventDefault();
    },     
}); 



// function that creates a new blobby visualisation
function initBlobVis(){
    // clear out the old visualisation if needed
    if (visjsobj != undefined){
        visjsobj.destroy();
    }
    var search = 'fundamentals.'+ Session.get("study");
    var stocks = Stocks.find({
        [search]: {$type: 1}});
    var list = [{
        id: 0,
        label: "All CCC",
        level: 1
    }];
    var edges = [];
    var sectorIndex = 0;
    var sectorList = {};
    stocks.forEach(function(stock){
        var sector = stock["Sector"];
        if (sectorList[sector] == undefined) {
            sectorIndex++;
            sectorList[sector] = sectorIndex;
            list.push({
                id: sectorList[sector],
                label: sector,
                group: sector,
                level: 2
            });
            edges.push({
                from: 0,
                to: sectorList[sector]
            });
        }
        list.push({
            id: stock._id,
            label: stock["Company name"],
            group: sector,
            value: Math.round(stock.fundamentals[Session.get("study")]* 100) / 100,
            level: 3
        });
        edges.push({
            from: sectorList[sector],
            to: stock._id
        });
    });

    // this data will be used to create the visualisation
    var data = {
      nodes: list,
      edges: edges
    };
    // options for the visualisation
     var options = {
        layout: {
            hierarchical: {enabled:true}
        },
        nodes: {
            borderWidth: 1,
            borderWidthSelected: 2,            
            shape: 'dot',
        }
    };
    // get the div from the dom that we'll put the visualisation into
    var container = document.getElementById('visjs');
    // create the visualisation
    visjsobj = new vis.Network(container, data, options);
}