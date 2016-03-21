/* global FS, Files, Excel, Stocks */

var url = "http://www.dripinvesting.org/tools/U.S.DividendChampions.xls";

// First with fetch the file and store it in the server.
// For that, it was necessary to add the CollectionFS package
var objFile = Files.findOne();
if (!objFile || objFile.uploadedAt.getTime() < new Date() - 15*24*60*60*100) {
    // if there is no file, or if the file is 15 days old, then insert fetch and insert new file.
    objFile = Files.insert(url);
}

// We don't need more than 1 downloaded file.
// So, in case there are more than 1 file, all will be deleted except the most recent one.
while (Files.find().count() > 1) {
    Files.remove({_id: Files.findOne({}, {sort: {uploadedAt: 1}})._id});
}

// Then we need to parse the downloaded file.
// For that I had to add the 
var path = Npm.require('path');
var basepath = path.resolve('.').split('.meteor')[0];

var excel = new Excel('xls');
var workbook = excel.readFile(basepath + "uploads/"+ Files.findOne().copies.files.key);
var workSheet = workbook.Sheets[workbook.SheetNames[3]];

var inserts = 0;
var updates = 0;
for (var row = 7; row < 1000; row++) {
    if (workSheet['A'+row] == undefined || workSheet['A'+row].v.indexOf("Averages") > -1 ) {
        continue
    } else {
        var stockObj = {
            "Company name": workSheet['A'+row].v,
            "Ticker symbol": workSheet['B'+row].v,
            "Industry": workSheet['C'+row].v,
            "Sector": workSheet['CB'+row].v,
            "Consecutive dividend years": workSheet['D'+row].v,
            "Dividend Reinvestment Plan": check_cell(workSheet['F'+row]),
            "Last price": workSheet['H'+row].v,
            "Dividend yield": workSheet['I'+row].v,
            "Actual quartely rate": workSheet['K'+row].v,
            "Recent quartely increase": workSheet['L'+row].v,
            "Annual dividend rate": workSheet['R'+row].v,
            "Ex_div date": new Date((workSheet['M'+row].v - (25567 + 2))*86400*1000),
            "Record date": new Date((workSheet['N'+row].v - (25567 + 2))*86400*1000),
            "Pay date": new Date((workSheet['O'+row].v - (25567 + 2))*86400*1000),
            "Payout ratio": workSheet['S'+row].v,
            "Price/Earnings": workSheet['U'+row].v,
            "Earnings per share": workSheet['W'+row].v,
            "PEG ratio": workSheet['X'+row].v,
            "Price/Sales ratio": workSheet['Y'+row].v,
            "Price/Book ratio": workSheet['Z'+row].v,
            "ROE": workSheet['AA'+row].v,
            "Market cap ($Mil)": workSheet['AG'+row].v,
            "Debt/Equity": workSheet['AI'+row].v,
            "Beta": workSheet['CM'+row].v
        };
        var stock = Stocks.findOne({"Ticker symbol": stockObj["Ticker symbol"]});
        if (!stock){
            Stocks.insert(stockObj);
            inserts++;
            console.log("Inserted "+ stockObj["Ticker symbol"]);
        } else {
            Stocks.update({_id: stock._id}, stockObj);
            updates++;
            console.log("Updated "+ stock["Ticker symbol"]);
        }
    }
}
if (inserts > 0) {console.log("Made " + inserts + " inserts into the database");}
if (updates > 0) {console.log("Made " + updates + " updates.");}

function check_cell(cell) {
    if (cell == undefined) {
        return " ";
    } else {
        return cell.v;
    }
}