Template.layout.onRendered(function(){
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
});

Template.layout.helpers({
    "files": function(){
        return Files.find();
    }
});