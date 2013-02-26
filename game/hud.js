

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

function drawMultiplier(dt) {
    if (typeof drawMultiplier.phase == 'undefined') {
        drawMultiplier.phase = 0;
    }
    drawMultiplier.phase += 0.01 * dt;

    var intMul = Math.floor(pl.multiplier);

    if (pl.multiplier <= 1) {
        return;
    }

    var fontSize = 150 * scale;
    var red = Math.min(255, (intMul - 1) * 10);
    var green = Math.min(255, (intMul - 1) * 5);
    var blue = Math.max(0, 255 - (intMul - 1) * 10);

    fontSize += Math.abs(Math.cos(drawMultiplier.phase * (intMul / 10))) * 20 * scale;
    
    ctx.fillStyle = "rgb(" + red + ", " + green + ", " + blue + ")";
    ctx.font = "bold " + fontSize + "px Sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("x" + intMul, canvasW / 2.0, 0);

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

        //if (countDown.value > 0) {
        //    playSound("countdown");
        //}
    }

    if (countDown.value == 0) {
        pl.canMove = true;

        floorArrows.start();
    }
    if (countDown.value < 0) {
        gamestate = GameState.PLAYING;
        playStartTime = new Date().getTime();

    }
}

function drawFloorArrows(dt) {
    if (typeof drawFloorArrows.phase === "undefined") {
        drawFloorArrows.phase = 0;
    }

    drawFloorArrows.phase += 0.009 * dt;
    if (drawFloorArrows.phase >= 4) {
        drawFloorArrows.phase = 0;
    }

    var phase = Math.floor(drawFloorArrows.phase);
    var unlit = "#005500",
        lit = "#00FF00";
    var x = 200 * scale,
        y = 300 * scale,
        yd = 150 * scale,
        w = 100 * scale,
        h = 100 * scale;

    ctx.beginPath();
    ctx.fillStyle = unlit;
    drawArrowShape(x, y, w, h);
    drawArrowShape(canvasW - x, y + yd * 2, w, h);

    drawArrowShape(x, y + yd, w, h);
    drawArrowShape(canvasW - x, y + yd * 3, w, h);

    drawArrowShape(x, y + yd * 2, w, h);
    drawArrowShape(canvasW - x, y, w, h);

    drawArrowShape(x, y + yd * 3, w, h);
    drawArrowShape(canvasW - x, y + yd, w, h);

    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = lit;
    drawArrowShape(x, y + yd * (3-phase), w, h);
    drawArrowShape(canvasW - x, y + yd * ((3-phase + 2) % 4) , w, h);
    ctx.fill();

    if (new Date().getTime() - floorArrows.startTime > floorArrows.length) {
        floorArrows.isOn = false;
    }
}

function drawArrowShape(x, y, w, h) {
    ctx.moveTo(x, y);
    ctx.lineTo(x - w / 2, y + h / 3 * 2);
    ctx.lineTo(x - w / 2, y + h);
    ctx.lineTo(x, y + h / 3 * 1);
    ctx.lineTo(x + w / 2, y + h);
    ctx.lineTo(x + w / 2, y + h / 3 * 2);
    ctx.closePath();
    //ctx.stroke();
    //ctx.fill();
}

