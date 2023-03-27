
$(function(){
    $("#nav-placeholder").load("../html/navbar.html");
    $("#nav-placeholder-operator").load("../html/navbar-operator.html");
    $("#nav-placeholder-shop").load("../html/navbar-shop.html");
    $("#nav-placeholder-ticket").load("../html/navbar-ticket.html");
    $("#nav-placeholder-manager").load("../html/navbar-manager.html");
    $("#logout-button").load("../html/logout.html");
    // $("#nav-placeholder").load("../html/navbar/navbar.html");
    // $("#nav-placeholder-operator").load("../html/navbar/navbar-operator.html");
    // $("#nav-placeholder-shop").load("../html/navbar/navbar-shop.html");
    // $("#nav-placeholder-ticket").load("/html/navbar/navbar-ticket.html");
    // $("#nav-placeholder-manager").load("/html/navbar/navbar-manager.html");
    // $("#logout-button").load("/html/navbar/logout.html");
});
function myFunction() {
    const x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}