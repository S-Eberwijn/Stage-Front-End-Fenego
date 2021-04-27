var i = 15; //countdown in 10 seconds
var intervalid;
intervalid = setInterval("countdown()", 1000);
function countdown() {
    if (i == 0) {
        javascript: history.back(-1)// Default: go to the previous page
        //window.location.href = "https://darklyh.com"; //you can also decide to redirect to which page
        clearInterval(intervalid);
    }
    document.getElementById("mes").innerHTML = i;
    i--;
}
window.onload = countdown;    // countdown starts as the page is loaded