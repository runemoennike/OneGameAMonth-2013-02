
var mouse = {
    x: 0,
    y: 0
}


var keys = new Array();
function doKeyDown(evt) {
    keys[evt.keyCode] = true;
}
function doKeyUp(evt) {
    keys[evt.keyCode] = false;
}

function mouseMove(e) {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
}
