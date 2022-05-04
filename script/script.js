

var clicks = 0;
var duration = 1;
function showup() {
    clicks += 1
    var msg = document.getElementById("message");
    if(clicks >= 5){
        msg.style.display = "block";
        setTimeout(
            function(){
                msg.style.display = "none";    
            }, 2000 * duration
        );
        clicks = 0;
        duration += 0.5;
    }
}