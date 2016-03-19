
var url = "http://www.dripinvesting.org/tools/U.S.DividendChampions.xls";
var response = HTTP.call( 'GET', url, {} );

var fs = Npm.require('fs');
var path = Npm.require('path');
var basepath = path.resolve('.').split('.meteor')[0];

var excel = new Excel('xls');

var workbook = excel.readFile( basepath+'public/c.xls');

var yourSheetsName = workbook.SheetNames;

console.log(yourSheetsName);