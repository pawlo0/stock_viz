Template.navbar.events({
    "click nav.navbar-fixed-top a": function(e){
        $('html, body').animate({
            scrollTop: $( $.attr(e.target, 'href') ).offset().top - 70
        }, 500);
        return false; 
    },
    
})