Template.layout.onRendered(function(){
    var screen = $(window).height();
    console.log(screen);
    $('#network').height(screen);
})