$(document).ready(function() {
    
    //Toggle different forum sections
    $(".group-head").click(function(e) {
        $(e.target.nextElementSibling).slideToggle();
        //$(".group-head").next().slideToggle();
    });
    
    
    //On hover expand
    $(".group-head").hover(function(e) {
        $(e.target).addClass("group-head-hover");
    });
    
    //On exit reduce
    $(".group-head").mouseout(function(e) {
        $(e.target).removeClass("group-head-hover");
    });
    
    
    
});