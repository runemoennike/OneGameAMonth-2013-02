var body;
var canvas;
var ctx;
var canvasW, canvasH;
var scale;
var rafId;

var fast = false;

var sfxPath = "sfx/";
var manifest = [
    { src: sfxPath + "pulse.mp3|" + sfxPath + "pulse.ogg", id: "bgmusic_1", data: 1 },
    { src: sfxPath + "countdown.mp3|" + sfxPath + "countdown.ogg", id: "countdown", data: 1 },
    { src: sfxPath + "deathnoise.mp3|" + sfxPath + "deathnoise.ogg", id: "deathnoise", data: 1 },
];

var shapes = [
    [[100, 0], [-50, 400], [400, 500]],
    [[1500, 100], [1200, 500], [1500, 1000], [1900, 500]],
    [[800, -400], [600, 200], [1000, 300]],
    [[-100, 700], [600, 900], [900, 1200], [-100, 1200]]
    /*[[0,0], [1000, 0], [1000, 1000], [0, 1000]]*/
]

var numSectorsX = 5;
var numSectorsY = 20;
var sectorBaseSize = 2000;
var sectorSize;
var sectors;

var GameState = { COUNTDOWN: 1, PLAYING: 2, DEAD: 3 }
var ScoreState = { GAINING: 1, LOSING: 2, LOSING_FAST: 3 }

var gamestate = GameState.COUNTDOWN;
var playStartTime;
var playLength = (3 * 60 + 6) * 1000;

var pl = {
    x: 0,
    y: 0,
    lx: 0,
    ly: 0,
    speed: 0.7,
    canMove: false,
    score: 0,
    scoreState: ScoreState.GAINING,
    hadCollision: false,
    size: 70
}

var mouse = {
    x: 0,
    y: 0
}

function init() {
    body = document.body;
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvasW = canvas.width = innerWidth;
    canvasH = canvas.height = innerHeight;
    scale = Math.sqrt((canvasW * canvasW + canvasH * canvasH)) / Math.sqrt((1920 * 1920) + (1080 * 1080));

    sectorSize = sectorBaseSize * scale;
    pl.x = pl.lx = sectorSize * numSectorsX / 2;
    pl.y = pl.ly = -sectorSize;

    createjs.FlashPlugin.BASE_PATH = "lib/"
    if (!createjs.SoundJS.checkPlugin(true)) {
        document.getElementById("error").style.display = "block";
        document.getElementById("content").style.display = "none";
        return;
    }

    document.getElementById("loader").className = "loader";

    preload = new createjs.PreloadJS();
    //Install SoundJS as a plugin, then PreloadJS will initialize it automatically.
    preload.installPlugin(createjs.SoundJS);

    preload.onComplete = loadComplete;

    generateSectors();

    //Load the manifest and pass 'true' to start loading immediately. Otherwise, you can call load() manually.
    preload.loadManifest(manifest, true);
}

function loadComplete(event) {
    document.getElementById("loader").className = "";
    document.getElementById("content").className = "running";

    window.addEventListener('keydown', doKeyDown, true);
    window.addEventListener('keyup', doKeyUp, true);

    canvas.addEventListener("mousemove", mouseMove, false);

    playSound("bgmusic_1");
    countDown.phaseStart = new Date().getTime();
    rafId = requestAnimationFrame(gameLoop);

    playSound("countdown");
}

function generateSectors() {
    sectors = new Array(numSectorsX * numSectorsY);

    for (var x = 0; x < numSectorsX; x++) {
        for (var y = 0; y < numSectorsY; y++) {
            sectors[y * numSectorsX + x] = generateShapes(x * sectorBaseSize, -y * sectorBaseSize);
        }
    }
}

function generateShapes(offX, offY) {
    var result = new Array(shapes.length);
    for (var shp = 0; shp < shapes.length; shp++) {
        result[shp] = new Array(shapes[shp].length);
        for (var point = 0; point < shapes[shp].length; point++) {
            result[shp][point] = [shapes[shp][point][0] + offX, shapes[shp][point][1] + offY];
        }
    }
    return result;
}

var time;
var fpsc = 0;
var fpst = 0;
var countDown = {
    isOn: true,
    length: 1200,
    phaseStart: 0,
    value: 3
}

function gameLoop() {
    rafId = requestAnimationFrame(gameLoop);
    var now = new Date().getTime(),
        dt = now - (time || now);
    time = now;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (pl.canMove) {
        movePlayer(dt);
    }

    if (pl.y < pl.ly) {
        pl.score += (pl.ly - pl.y);
        pl.scoreState = ScoreState.GAINING;
    } else if (pl.y > pl.ly) {
        pl.score -= (pl.y - pl.ly) / 2;
        pl.scoreState = ScoreState.LOSING_FAST;
    } else {
        pl.score -= dt / 100;
        pl.scoreState = ScoreState.LOSING;
    }

    if (pl.score < 0) {
        pl.score = 0;
    }

    drawFloor(dt);
    drawAim(dt);
    drawPlayer(dt);

    ctx.translate(-pl.x, -pl.y);
    ctx.scale(scale, scale);
    drawSectors();

    ctx.restore();

    if (gamestate == GameState.COUNTDOWN) {
        drawCountdown();
    }

    if (gamestate == GameState.PLAYING) {
        drawTimer(dt);
        drawScore(dt);
    }

    pl.lx = pl.x;
    pl.ly = pl.y;

    fpsc++;
    if (now - fpst > 1000) {
        document.getElementById("debug_fps").innerHTML = fpsc;
        fpsc = 0;
        fpst = now;
    }


    document.getElementById("debug_frametime").innerHTML = dt;
}

function drawScore(dt) {
    if (typeof drawScore.phase == 'undefined') {
        drawScore.phase = 0;
    }
    drawScore.phase += 0.01 * dt;

    var fontSize = 100 * scale;
    var red = 0;
    var green = 255;
    var blue = 0;

    if (pl.scoreState == ScoreState.LOSING) {
        fontSize += Math.abs(Math.cos(drawScore.phase)) * 20 * scale;
        red = 128;
    } else if (pl.scoreState == ScoreState.LOSING_FAST) {
        fontSize += Math.abs(Math.cos(drawScore.phase * 2)) * 30 * scale;
        red = 200;
    }

    ctx.fillStyle = "rgb(" + red + ", " + green + ", " + blue + ")";
    ctx.font = "bold " + fontSize + "px Sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(Math.floor(pl.score), canvasW * .02, 0);

}

function drawTimer(dt) {
    var now = new Date().getTime();
    var timeLeft = playLength - (now - playStartTime);
    var perc = timeLeft / playLength;

    var secs = timeLeft / 1000;
    var mm = Math.floor(secs / 60);
    var ss = Math.floor(secs - (mm * 60));
    var hs = Math.floor((timeLeft - mm * 60000 - ss * 1000) / 10)

    if (ss < 10) {
        ss = "0" + ss;
    }
    if (hs < 10) {
        hs = "0" + hs;
    }

    var fontSize = 100 * scale;
    var red = Math.floor((1 - perc) * 255);
    var green = Math.floor((perc) * 255);
    ctx.fillStyle = "rgb(" + red + ", " + green + ", 0)";
    ctx.font = "bold " + fontSize + "px Sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText(mm + ":" + ss + "." + hs, canvasW * .98, 0);

}

function drawCountdown(dt) {
    var now = new Date().getTime();
    var perc = (now - countDown.phaseStart) / (countDown.length / 3);

    var fontSize = 1000 * scale * perc;
    ctx.fillStyle = "#FF0000";
    ctx.font = "bold " + fontSize + "px Sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(countDown.value > 0 ? countDown.value : "GO", canvasW / 2, canvasH / 2);


    if (now - countDown.phaseStart > countDown.length / 3) {
        countDown.value--;
        countDown.phaseStart = now;

        if (countDown.value > 0) {
            playSound("countdown");
        }
    }

    if (countDown.value == 0) {
        pl.canMove = true;
    }
    if (countDown.value < 0) {
        gamestate = GameState.PLAYING;
        playStartTime = new Date().getTime();
    }
}

function movePlayer(dt) {
    if (38 in keys && keys[38] || 87 in keys && keys[87]) { //up
        if (!testPointCollides([pl.x, pl.y - dt * pl.speed], pl.size)) {
            pl.y -= dt * pl.speed;
        }
    }
    if (40 in keys && keys[40] || 83 in keys && keys[83]) { //down
        if (!testPointCollides([pl.x, pl.y + dt * pl.speed], pl.size)) {
            pl.y += dt * pl.speed;
        }
    }
    if (37 in keys && keys[37] || 65 in keys && keys[65]) { //left
        if (!testPointCollides([pl.x - dt * pl.speed, pl.y], pl.size)) {
            pl.x -= dt * pl.speed;
        }
    }
    if (39 in keys && keys[39] || 68 in keys && keys[68]) { //right
        if (!testPointCollides([pl.x + dt * pl.speed, pl.y], pl.size)) {
            pl.x += dt * pl.speed;
        }
    }


    //ctx.fillStyle = "#FFF";
    //ctx.fillRect(pl.x / scale + canvasW / scale / 2, pl.y / scale + canvasH / scale / 3 * 2, 100, 100);
    //document.getElementById("debug_bla").innerHTML = Math.floor(testPlayerCollides());
}

function testPointCollides(test, size) {
    console.log(test);
    var tsx = Math.floor(test[0] / sectorSize + 0.5);
    var tsy = Math.floor(-test[1] / sectorSize + 0.5);
    var sector = sectors[tsy * numSectorsX + tsx];

    var testx = test[0] / scale + canvasW / scale / 2;
    var testy = test[1] / scale + canvasH / scale / 3 * 2;

    //return testInsideSectorPolys(sector, [testx, testy]);
    return findClosesDistToSectorPoly(sector, [testx, testy]) < size;
}

function findClosesDistToSectorPoly(sector, test) {
    var closest = 999999999;
    for (var si = 0; si < sector.length; si++) {
        for (var li = 0; li < sector[si].length; li++) {
            var p2 = (li == sector[si].length - 1) ? sector[si][0] : sector[si][li + 1];
            var distSq = distToSegmentSquared(test, sector[si][li], p2);
            if (distSq < closest) {
                closest = distSq;
            }
        }
    }
    return Math.sqrt(closest);
}

function testInsideSectorPolys(sector, test) {
    for (var si = 0; si < sector.length; si++) {
        if (testInsidePoly(sector[si].length, sector[si], test)) {
            return true;
        }
    }

    return false;
}

function drawFloor(dt) {
    var s = 300 * scale;
    var flip = Math.floor(pl.x / s) % 2 == 0 || Math.floor(pl.y / s) % 2 != 0;
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 50;
    ctx.shadowBlur = (fast ? 0 : 20);
    ctx.shadowColor = "#000022";
    for (var x = 0; x < 9; x++) {
        var rx = x * s - pl.x % s - s / 2;
        ctx.beginPath();
        ctx.moveTo(rx, 0);
        ctx.lineTo(rx, canvasH);
        ctx.stroke();
    }

    for (var x = 0; x < 6; x++) {
        var ry = x * s - pl.y % s - s / 2;
        ctx.beginPath();
        ctx.moveTo(0, ry);
        ctx.lineTo(canvasW, ry);
        ctx.stroke();
    }
    ctx.shadowBlur = 0;
}

function drawAim(dt) {
    if (typeof drawAim.phase == 'undefined') {
        drawAim.phase = 0;
    }
    drawAim.phase += 0.01 * dt;

    var x = mouse.x;
    var y = mouse.y;
    var px = canvasW / 2;
    var py = canvasH / 3 * 2;
    var ri = 10 * scale + Math.cos(drawAim.phase) / 2.0;
    var ro = 20 * scale + Math.cos(drawAim.phase) / 2.0;

    var grd = ctx.createLinearGradient(px, py, x, y);
    grd.addColorStop(0, "#000015");
    grd.addColorStop(1, "#211300");

    ctx.strokeStyle = grd;
    ctx.lineWidth = 10;
    ctx.shadowBlur = (fast ? 0 : 20);
    ctx.shadowColor = "#4C2B00";
    ctx.globalAlpha = 0.5;

    ctx.beginPath();
    ctx.moveTo(px, py);

    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1.0;


    grd = ctx.createRadialGradient(x, y, ri, x, y, ro);
    grd.addColorStop(0, "#000");
    grd.addColorStop(0.7, "#FFA500");
    grd.addColorStop(0.9, "#8B5A00");
    grd.addColorStop(1.0, "#000");

    // Fill with gradient
    ctx.beginPath();
    ctx.arc(x, y, ro, 0, 2 * Math.PI, false);
    ctx.fillStyle = grd;
    ctx.fill();
}

function drawPlayer(dt) {
    if (typeof drawPlayer.phase == 'undefined') {
        drawPlayer.phase = 0;
    }

    var x = canvasW / 2;
    var y = canvasH / 3 * 2;
    var ri = 0;
    var ro = pl.size * scale;

    drawPlayer.phase += 0.012 * dt;

    var grd = ctx.createRadialGradient(x, y, ri, x, y, ro);
    grd.addColorStop(0, "#000");
    grd.addColorStop(0.4 + Math.cos(drawPlayer.phase) / 50, "#0000AA");
    grd.addColorStop(0.5 + Math.sin(drawPlayer.phase) / 40, "#AAAAFF");
    grd.addColorStop(0.7 + Math.cos(drawPlayer.phase) / 20, "#0000FF");
    grd.addColorStop(0.9, "#000022");

    // Fill with gradient
    ctx.beginPath();
    ctx.arc(x, y, ro, 0, 2 * Math.PI, false);
    ctx.fillStyle = grd;
    ctx.fill();
}

function drawSectors() {
    document.getElementById("debug_pos").innerHTML = Math.floor(pl.x) + "," + Math.floor(pl.y);

    var plsx = Math.floor(pl.x / sectorSize + 0.5);
    var plsy = Math.floor(-pl.y / sectorSize + 0.5);

    document.getElementById("debug_sector").innerHTML = plsx + "," + plsy;

    for (var x = -2; x <= 2; x++) {
        for (var y = -2; y <= 2; y++) {
            var sx = plsx + x;
            var sy = plsy + y;
            if (sx >= 0 && sx < numSectorsX && sy >= 0 && sy < numSectorsY) {
                drawShapes(sectors[sy * numSectorsX + sx]);
            }
        }
    }
}

function drawShapes(shps) {
    ctx.lineWidth = 30;
    ctx.lineJoin = "miter";
    ctx.strokeStyle = "#00AAAA";
    ctx.fillStyle = "#001111";
    ctx.shadowBlur = (fast ? 0 : 20);
    ctx.shadowColor = "#55AAAA";
    for (var i = 0; i < shps.length; i++) {
        ctx.beginPath();
        ctx.moveTo(shps[i][0][0], shps[i][0][1]);
        for (var p = 1; p < shps[i].length; p++) {
            ctx.lineTo(shps[i][p][0], shps[i][p][1]);
        }
        ctx.closePath();

        if (ctx.isPointInPath(canvasW / 2, canvasH / 3 * 2)) {
            pl.hadCollision = true;
        }

        ctx.stroke();
        ctx.fill();
    }
    ctx.shadowBlur = 0;
}

function kill() {
    if (preload != null) { preload.close(); }
    createjs.SoundJS.stop();
    cancelAnimationFrame(rafId);
}

function playSound(id) {
    //Play the sound: play (src, interrupt, delay, offset, loop, volume, pan)
    var instance = createjs.SoundJS.play(id, createjs.SoundJS.INTERRUPT_ANY, 0, 0, false, 1);
    if (instance == null || instance.playState == createjs.SoundJS.PLAY_FAILED) { return; }
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

function sqr(x) { return x * x }
function dist2(v, w) { return sqr(v[0] - w[0]) + sqr(v[1] - w[1]) }
function distToSegmentSquared(p, v, w) {
    var l2 = dist2(v, w);
    if (l2 == 0) return dist2(p, v);
    var t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
    if (t < 0) return dist2(p, v);
    if (t > 1) return dist2(p, w);
    return dist2(p, [
        v[0] + t * (w[0] - v[0]),
        v[1] + t * (w[1] - v[1])
    ]);
}
function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }

function testInsidePoly(nvert, verts, test) {
    var i, j, c = false;
    for (i = 0, j = nvert - 1; i < nvert; j = i++) {
        if (((verts[i][1] > test[1]) != (verts[j][1] > test[1])) &&
         (test[0] < (verts[j][0] - verts[i][0]) * (test[1] - verts[i][1]) / (verts[j][1] - verts[i][1]) + verts[i][0]))
            c = !c;
    }
    return c;
}