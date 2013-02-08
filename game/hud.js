

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