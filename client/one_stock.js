/* global Stocks */

var visjsbar;

Template.one_stock_controls.helpers({
    "get_stock_list": function() {
        var stocks = Stocks.find();
        
        if (Session.get("stock") == undefined) {
            Session.set("stock", "MSFT");
        }
        var list = [];
        stocks.forEach(function(stock){
            var isSelected = "";
            if (Session.get("stock") == stock["Ticker symbol"]) {
                isSelected = "selected";
            }
            list.push({name: stock["Company name"], ticker: stock["Ticker symbol"], isSelected: isSelected});
        });
        return list;
    },
    "stock_info":function(){
        var stock = Stocks.findOne({["Ticker symbol"]: Session.get("stock")});
        if (stock) {
            return {
                name: stock["Company name"],
                ticker: stock["Ticker symbol"],
                industry: stock["Industry"],
                sector: stock["Sector"],
                qtly_rate: stock["Actual quartely rate"],
                annual_rate: stock["Annual dividend rate"],
                ex_div: new Date(stock["Ex_div date"]).toISOString().slice(0, 10),
                record: new Date(stock["Record date"]).toISOString().slice(0, 10),
                pay: new Date(stock["Pay date"]).toISOString().slice(0, 10),
                years: stock.fundamentals["Consecutive dividend years"],
                div_yield: Math.round(stock.fundamentals["Dividend yield (%)"] *100)/100,
                increase: Math.round(stock.fundamentals["Recent quartely increase (%)"]*100)/100,
                payout: Math.round(stock.fundamentals["Payout ratio"]*100)/100,
                p_e: Math.round(stock.fundamentals["Price/Earnings"]*100)/100,
                earnings: Math.round(stock.fundamentals["Earnings per share"]*100)/100,
                debt: Math.round(stock.fundamentals["Debt/Equity"]*100)/100,
                sales: Math.round(stock.fundamentals["Price/Sales ratio"]*100)/100,
                book: Math.round(stock.fundamentals["Price/Book ratio"]*100)/100,
                roe: Math.round(stock.fundamentals["ROE"]*100)/100,
                peg: Math.round(stock.fundamentals["PEG ratio"]*100)/100,
                marketcap: Math.round(stock.fundamentals["Market cap ($Mil)"]*100)/100,
                beta: Math.round(stock.fundamentals["Beta"]*100)/100,
            };            
        }
    }
});

Template.one_stock_controls.events({
    "click .js-show-timeline": function(event){
        initDateVis();
        event.preventDefault();
    },
    "change .js-select-single":function(event){
        Session.set("stock", event.target.value);
        event.preventDefault();
    }
});

// function that creates a new timeline visualisation
function initDateVis(){
  // clear out the old visualisation if needed
  if (visjsbar != undefined){
    visjsbar.destroy();
  }
  
  var divs = Stocks.findOne({["Ticker symbol"]: Session.get("stock")}).divs_per_year;
  
  var items = [];
  // iterate the songs collection, converting each song into a simple
  // object that the visualiser understands
  for (var dividend in divs) {
      items.push({
        x: dividend+"-01-01", 
        y: divs[dividend], 
      });
  }
  var dataset = new vis.DataSet(items);
  
  var options = {
    drawPoints: {
        style: "circle"
    },
    shaded: {
        orientation: "bottom"
    },
    width:  '100%',
    height: '100%',
  };
  // get the div from the DOM that we are going to 
  // put our graph into 
  var container = document.getElementById('visjsbar');
  // create the graph
  visjsbar = new vis.Graph2d(container, dataset, options);
  
}