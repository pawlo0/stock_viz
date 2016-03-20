/* global FS, Files, Excel */

var url = "http://www.dripinvesting.org/tools/U.S.DividendChampions.xls";

var objFile = Files.findOne();
if (!objFile) {
    objFile = Files.insert(url);
} else if (objFile.uploadedAt.getTime() < new Date() - 30*24*60*60*100 || Files.find().count() > 1) {
    while (Files.find().count() > 0) {
        Files.remove({_id: Files.findOne()._id});
    }
    objFile = Files.insert(url);
}

var path = Npm.require('path');
var basepath = path.resolve('.').split('.meteor')[0];

var excel = new Excel('xls');
var workbook = excel.readFile(basepath + "uploads/"+ Files.findOne().copies.files.key);
var yourSheetsName = workbook.SheetNames;
console.log(yourSheetsName);
