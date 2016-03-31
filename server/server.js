/* global Stocks, Files */

Meteor.publish("stocks", function () {
  return Stocks.find();
});

Meteor.publish("files", function () {
  return Files.find();
});


Files.allow({
  'download': function() {
    return true;
  }
});


Meteor.startup(insertFile);
Meteor.setInterval(insertFile, 24*60*60*1000);

function insertFile() {
  if(!Files.findOne() || Files.findOne().uploadedAt-new Date() > 24*60*60*1000) {
      var url = "http://www.dripinvesting.org/tools/U.S.DividendChampions.xls";
      var fileObj = Files.insert(url);
      console.log("Inserted file: " + fileObj._id);
      Files.remove({_id: {$ne: fileObj._id}});
  }
}

Meteor.methods({
  "insertDB": function(workSheet){
    // Variables to count the inserts or updates
    var inserts = 0;
    var updates = 0;
    var insertedSymbs = "Tickers symbols inserted: ";
    var updatedSymbs = "Tickers Symbols updated: ";
    
    // Cycle that goes through the lines of the worksheet.
    for (var row = 7; row < 1000; row++) {
        
        if (workSheet['A'+row] == undefined || workSheet['A'+row].v.indexOf("Averages") > -1 ) {
            // if cell A of that row is empty or if has 'averages' in it, it will discarded
            continue;
        } else {
            
            // First we prepare the object
            // In some places we have to deal with empty cells
            // made function named check_cell to deal with it
            
            var stockObj = {
                "Company name": workSheet['A'+row].v,
                "Ticker symbol": workSheet['B'+row].v,
                "Industry": workSheet['C'+row].v,
                "Sector": workSheet['CB'+row].v,
                "Quote": workSheet['H'+row].v,
                "Actual quartely rate": workSheet['K'+row].v,
                "Annual dividend rate": workSheet['R'+row].v,
                "Ex_div date": new Date((workSheet['M'+row].v - (25567 + 2))*86400*1000),
                "Record date": new Date((workSheet['N'+row].v - (25567 + 2))*86400*1000),
                "Pay date": new Date((workSheet['O'+row].v - (25567 + 2))*86400*1000),
                fundamentals: {
                    "Consecutive dividend years": workSheet['D'+row].v,
                    "Dividend yield (%)": workSheet['I'+row].v,
                    "Recent quartely increase (%)": workSheet['L'+row].v,
                    "Payout ratio": workSheet['S'+row].v,
                    "Price/Earnings": workSheet['U'+row].v,
                    "Earnings per share": workSheet['W'+row].v,
                    "Debt/Equity": workSheet['AI'+row].v,
                    "Price/Sales ratio": workSheet['Y'+row].v,
                    "Price/Book ratio": workSheet['Z'+row].v,
                    "ROE": workSheet['AA'+row].v,
                    "PEG ratio": workSheet['X'+row].v,
                    "Market cap ($Mil)": workSheet['AG'+row].v,
                    "Beta": workSheet['CM'+row].v, 
                },
                updatedAt: new Date((workSheet['H5'].v - (25567 + 2))*86400*1000),
                divs_per_year: {},
            };
            stockObj.divs_per_year[workSheet['AP6'].v] = workSheet['AP' + row].v;
            stockObj.divs_per_year[workSheet['AQ6'].v] = workSheet['AQ' + row].v;
            stockObj.divs_per_year[workSheet['AR6'].v] = workSheet['AR' + row].v;
            stockObj.divs_per_year[workSheet['AT6'].v] = workSheet['AT' + row].v;
            stockObj.divs_per_year[workSheet['AU6'].v] = workSheet['AU' + row].v;
            stockObj.divs_per_year[workSheet['AW6'].v] = workSheet['AW' + row].v;
            stockObj.divs_per_year[workSheet['AX6'].v] = workSheet['AX' + row].v;
            stockObj.divs_per_year[workSheet['AY6'].v] = workSheet['AY' + row].v;
            stockObj.divs_per_year[workSheet['AZ6'].v] = workSheet['AZ' + row].v;
            stockObj.divs_per_year[workSheet['BA6'].v] = workSheet['BA' + row].v;
            stockObj.divs_per_year[workSheet['BB6'].v] = workSheet['BB' + row].v;
            stockObj.divs_per_year[workSheet['BC6'].v] = workSheet['BC' + row].v;
            stockObj.divs_per_year[workSheet['BD6'].v] = workSheet['BD' + row].v;
            stockObj.divs_per_year[workSheet['BE6'].v] = workSheet['BE' + row].v;
            stockObj.divs_per_year[workSheet['BF6'].v] = workSheet['BF' + row].v;
            stockObj.divs_per_year[workSheet['BG6'].v] = workSheet['BG' + row].v;
            stockObj.divs_per_year[workSheet['BH6'].v] = workSheet['BH' + row].v;
            
            // Looks for records with the same symbol of the prepared object.
            var stock = Stocks.findOne({"Ticker symbol": stockObj["Ticker symbol"]});
            
            if (!stock){
                // In case the symbol of stockObj doesn't exist, it will insert the object
                Stocks.insert(stockObj);
                inserts++;
                insertedSymbs += stockObj["Ticker symbol"]+", ";
            } else if (stock.updatedAt < stockObj.updatedAt) {
                // Otherwise, in case there is already the same symbol in the database,
                // it will update the record rather than insert a new one.
                Stocks.update({_id: stock._id}, stockObj);
                updates++;
                updatedSymbs += stockObj["Ticker symbol"]+", ";
            } else {
                //console.log("no update needed for " + stockObj["Ticker symbol"])
            }
        }
    }
    
    
    // Logs of how many inserts and/or updates.
    var logResult = "";
    if (inserts > 0) {logResult += "Made " + inserts + " inserts into the database. " + insertedSymbs;}
    if (updates > 0) {logResult += "Made " + updates + " updates. " + updatedSymbs;}
    if (inserts == 0 && updates == 0) { logResult = "No inserts nor updates were made.";}
    return logResult;
  }
})