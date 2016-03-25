/* global Stocks */

var visjsobj3d;

Template.stock_viz_3d_controls.helpers({
    "get_data_for_3d": function(axis){
        // pull an example from the database
        // - we'll use this to find the names of all features
        var stock = Stocks.findOne();

        if (Session.get("x_axis") == undefined){
            Session.set("x_axis", "Consecutive dividend years");
        }
        if (Session.get("y_axis") == undefined){
            Session.set("y_axis", "Market cap ($Mil)");
        }
        if (Session.get("z_axis") == undefined){
            Session.set("z_axis", "Dividend yield (%)");
        }
        if (Session.get("z_value") == undefined){
            Session.set("z_value", "Recent quartely increase (%)");
        } 

        if (stock){
            var list = [];
            for (var f in stock.fundamentals) {
                var isSelected = "";
                if(Session.get(axis) == f) {
                    isSelected = "selected";
                }
                list.push({name: f, isSelected: isSelected});
            }
        }
        return list;        
    }
});


Template.stock_viz_3d_controls.events({
    // event handler for when user changes the selected
    // option in the drop down list
    "change .js-select-x-3d-data":function(event){
        Session.set("x_axis", event.target.value);
        event.preventDefault();
    },
    "change .js-select-y-3d-data":function(event){
        Session.set("y_axis", event.target.value);
        event.preventDefault();
    },    
    "change .js-select-z-3d-data":function(event){
        Session.set("z_axis", event.target.value);
        event.preventDefault();
    },
    "change .js-select-zvalue-3d-data":function(event){
        Session.set("z_value", event.target.value);
        event.preventDefault();
    },    
     "click .js-show-3d":function(event){
      drawVisualization();
      event.preventDefault();
    }    
});

function drawVisualization() {
    // clear out the old visualisation if needed
    if (visjsobj3d != undefined){
    visjsobj3d.redraw();
    }
    // Trick to make sure wwe don't have data that is not a number:
    var search_x = 'fundamentals.'+ Session.get("x_axis");
    var search_y = 'fundamentals.'+ Session.get("y_axis");
    var search_z = 'fundamentals.'+ Session.get("z_axis");
    var search_zvalue = 'fundamentals.'+ Session.get("z_value");
    var stocks = Stocks.find({
        [search_x]: {$type: 1},
        [search_y]: {$type: 1},
        [search_z]: {$type: 1},
        [search_zvalue]: {$type: 1}
    });
    
    var data = new vis.DataSet();
    stocks.forEach(function(stock){
        data.add({
          x: stock.fundamentals[Session.get("x_axis")],
          y: stock.fundamentals[Session.get("y_axis")],
          z: stock.fundamentals[Session.get("z_axis")],
          style: stock.fundamentals[Session.get("z_value")]
        });
    });
    
        
    // specify options
    var options = {
        width:  '100%',
        height: '100%',
        style: 'dot-size',
        keepAspectRatio: false,
        xLabel: Session.get("x_axis"),
        yLabel: Session.get("y_axis"),
        zLabel: Session.get("z_axis"),
        tooltip: function(point) {
            return point.z;
        },
        legendLabel: Session.get("z_value")
    };
    
    var container = document.getElementById('visjs3d');
    // create the graph
    visjsobj3d = new vis.Graph3d(container, data, options);
    // tell the graph to set up its axes so all data points are shown
}