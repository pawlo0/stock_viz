/* global Stocks, Files, FS, XLSX */

Meteor.subscribe("stocks");
Meteor.subscribe("files");





Template.layout.onRendered(function(){
    

    
});

Template.layout.helpers({
    "weHaveStocks": function(){
       if (Stocks.findOne()){
           return true;
       } 
    },
    "updatedAt": function(){
        return formatDate(Stocks.findOne().updatedAt);
    },
    "checkData": function (e) {
        if (Files.findOne()){
            if (!Stocks.findOne() || new Date() - Stocks.findOne().updatedAt > 30*24*60*60*1000) {
                var url = Meteor.absoluteUrl(Files.findOne().url().substring(1));
                var oReq = new XMLHttpRequest();
                oReq.open("GET", url, true);
                oReq.responseType = "arraybuffer";
                
                oReq.onload = function(e) {
                  var arraybuffer = oReq.response;
                
                  /* convert data to binary string */
                  var data = new Uint8Array(arraybuffer);
                  var arr = new Array();
                  for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                  var bstr = arr.join("");
                
                  /* Call XLSX */
                  var workbook = XLSX.read(bstr, {type:"binary"});
                  // I know before hand that we need the 4th sheet.
                  var workSheet = workbook.Sheets[workbook.SheetNames[3]];
                  Meteor.call("insertDB", workSheet, function(error, result){
                        if(error){
                            console.log(error);
                        } else {
                            console.log(result);
                        }
                    });
                };
                oReq.send();
            }
        }
        var screen = $(window).height();
        if ($('#network').height() < screen) {
            $('#network').height(screen);
        }
        if ($('#top').height() < screen) {
            $('#top').height(screen);
        }
        if ($('#3dgraph').height() < screen) {
            $('#3dgraph').height(screen);
        }
        if ($('#individual').height() < screen) {
            $('#individual').height(screen);
        }    
        if ($('#footer').height() < screen) {
            $('#footer').height(screen);
        }
    }
})


function formatDate(date){
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var dateString = day + '/' + monthNames[monthIndex] + '/' + year;
    return dateString;    
}