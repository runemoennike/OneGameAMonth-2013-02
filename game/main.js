
var time;
var fpsc = 0;
var fpst = 0;
var preload;

function init() {
    body = document.body;
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvasW = canvas.width = innerWidth;
    canvasH = canvas.height = innerHeight;
    scale = Math.sqrt((canvasW * canvasW + canvasH * canvasH)) / Math.sqrt((1920 * 1920) + (1080 * 1080));

    sectorSize = sectorBaseSize * scale;
    pl.x = pl.lx = sectorSize * (numSectorsX / 2.0 - 0.5);
    pl.y = pl.ly = -sectorSize;

    createjs.FlashPlugin.BASE_PATH = "lib/"
    if (!createjs.SoundJS.checkPlugin(true)) {
        document.getElementById("error").style.display = "block";
        document.getElementById("content").style.display = "none";
        return;
    }

    document.getElementById("loader").className = "loader";
    asd = 1;
    preload = new createjs.PreloadJS();
    //Install SoundJS as a plugin, then PreloadJS will initialize it automatically.
    preload.installPlugin(createjs.SoundJS);

    preload.onComplete = loadComplete;

    generateSectors();

    //Load the manifest and pass 'true' to start loading immediately. Otherwise, you can call load() manually.
    preload.loadManifest(sfxManifest, true);
}

function loadComplete(event) {
    document.getElementById("loader").className = "";
    document.getElementById("content").className = "running";

    window.addEventListener('keydown', doKeyDown, true);
    window.addEventListener('keyup', doKeyUp, true);

    canvas.addEventListener("mousemove", mouseMove, false);
    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mouseup", mouseUp, false);
    canvas.addEventListener("mouseout", mouseUp, false);

    playSound("bgmusic_1");
    countDown.phaseStart = new Date().getTime();
    rafId = requestAnimationFrame(gameLoop);

    playSound("countdown");
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

        if (mouse.b) {
            playerShoot();
        }
    }
    updateBullets(dt);

    updateScore(dt);

    drawFloor(dt);

    ctx.translate(-pl.x, -pl.y);
    ctx.scale(scale, scale);
    drawSectors();
    drawBullets();

    ctx.restore();

    if (floorArrows.isOn) {
        drawFloorArrows(dt);
    }

    drawPlayer(dt);
    drawAim(dt);

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




function kill() {
    if (preload != null) { preload.close(); }
    createjs.SoundJS.stop();
    cancelAnimationFrame(rafId);
}
