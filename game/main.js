
var time;
var fpsc = 0;
var fpst = 0;
var preload;

function init() {
    body = document.body;
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    setSizes();
    pl.x = pl.lx = sectorSize * (numSectorsX / 2.0 - 0.5);
    pl.y = pl.ly = -sectorSize * 2;
    //window.onresize = setSizes;

    createjs.FlashPlugin.BASE_PATH = "lib/"
    if (!createjs.Sound.initializeDefaultPlugins()) {
        document.getElementById("error").style.display = "block";
        document.getElementById("content").style.display = "none";
        return;
    }

    document.getElementById("loader").className = "loader";
    preload = new createjs.PreloadJS();
    //Install Sound as a plugin, then PreloadJS will initialize it automatically.
    preload.installPlugin(createjs.Sound);

    preload.onComplete = loadComplete;

    generateSectors();

    //Load the manifest and pass 'true' to start loading immediately. Otherwise, you can call load() manually.
    preload.loadManifest(sfxManifest, true);
}

function setSizes() {
    var oldScale = scale;
    canvasW = canvas.width = innerWidth;
    canvasH = canvas.height = innerHeight;
    scale = Math.sqrt((canvasW * canvasW + canvasH * canvasH)) / Math.sqrt((1920 * 1920) + (1080 * 1080));

    sectorSize = sectorBaseSize * scale;

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

    if (gamestate == GameState.PLAYING || gamestate == GameState.COUNTDOWN) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (pl.canMove) {
            movePlayer(dt);

            if (mouse.b) {
                playerShoot();
            }
        }
        if (gamestate == GameState.PLAYING) {
            updateEnemies(dt);
        }
        updateBullets(dt);

        updateScore(dt);

        drawFloor(dt);

        ctx.translate(-pl.x, -pl.y);
        ctx.scale(scale, scale);
        drawFinishLine();
        drawSectors();
        drawBullets();
        drawEnemies(dt);

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
            drawMultiplier(dt);
        }

        pl.lx = pl.x;
        pl.ly = pl.y;

        if (now - pl.lastDamageTime > pl.hpRegenDelay) {
            pl.hp = Math.min(pl.fullHp, pl.hp + pl.hpRegen * dt);
        }
        if (now - pl.lastMultiplierIncreaseTime > pl.multiplierTime && pl.multiplier > 1) {
            pl.multiplier = Math.max(1.0, pl.multiplier - 0.01 * dt);
        }
        if (pl.hp <= 0 || now - playStartTime > playLength) {
            gamestate = GameState.DEAD;
            showChrome();
            createjs.Sound.stop();
        }
        if (playerScaledWorldPos()[1] < finishLineY) {
            gamestate = GameState.WON;
            showChrome();
            createjs.Sound.stop();
            playSound("win");
        }
    } else if (gamestate == GameState.DEAD) {
        drawDeadScreen();
        playSound("deathnoise");
    } else if (gamestate == GameState.WON) {
        drawWinScreen();
    }

    fpsc++;
    if (now - fpst > 1000) {
        document.getElementById("debug_fps").innerHTML = fpsc;
        fpsc = 0;
        fpst = now;
    }


    document.getElementById("debug_frametime").innerHTML = dt;
    document.getElementById("debug_hp").innerHTML = Math.round(pl.hp);
    document.getElementById("debug_pos").innerHTML = Math.floor(playerScaledWorldPos()[0]) + "," + Math.floor(playerScaledWorldPos()[1]);
}


function drawDeadScreen() {
    var bsx = canvasW / 50,
        bsy = canvasH / 50;

    for (var x = 0; x < canvasW; x += bsx) {
        for (var y = 0; y < canvasH; y += bsy) {
            var l = rndInt(0, 255);
            ctx.fillStyle = "rgb(" + l + "," + l + "," + l + ")";
            ctx.fillRect(x, y, bsx, bsy);
        }
    }

    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "#000";
    ctx.font = "bold " + (300*scale) + "px Sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over", canvasW / 2, canvasH / 2);

    ctx.font = "bold " + (80 * scale) + "px Sans-serif";
    ctx.fillText("You didn't make it, zero points!", canvasW / 2, canvasH / 2 + 200 * scale);
    ctx.globalAlpha = 1.0;

}

function drawWinScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "#FFF";
    ctx.font = "bold " + (300 * scale) + "px Sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("You Win!", canvasW / 2, canvasH / 2); //

    ctx.fillStyle = "#00FF00";
    ctx.font = "bold " + (80 * scale) + "px Sans-serif";
    ctx.fillText(Math.floor(pl.score), canvasW / 2, canvasH / 2 + 200 * scale); 
    ctx.globalAlpha = 1.0;
}

function showChrome() {
    document.getElementById("credits").style.display = "block";
    document.getElementById("content").className = "paused";
    document.getElementById("playagain").style.display = "block";
}

function kill() {
    if (preload != null) { preload.close(); }
    createjs.Sound.stop();
    showChrome();
    cancelAnimationFrame(rafId);
}
