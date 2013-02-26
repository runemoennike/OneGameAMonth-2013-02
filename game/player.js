﻿
var pl = {
    x: 0,
    y: 0,
    lx: 0,
    ly: 0,
    speed: 1.0,
    healShieldTime: 1000,
    canMove: false,
    score: 0,
    scoreState: ScoreState.GAINING,
    lastScoreGainTime: 0,
    hadCollision: false,
    size: 70,
    lastFire: 0,
    bulletType: BulletType.BANANA,
    fullHp: 30,
    hp: 30,
    hpRegen: 0.005,
    hpRegenDelay: 4000,
    lastDamageTime: 0,
    lastHealTime: 0,
    multiplier: 1,
    lastMultiplierIncreaseTime: 0,
    multiplierTime: 5000
}


function movePlayer(dt) {
    var moveVec = [0, 0];

    if (38 in keys && keys[38] || 87 in keys && keys[87]) { //up
        moveVec[1] -= 1;
    }
    if (40 in keys && keys[40] || 83 in keys && keys[83]) { //down
        moveVec[1] += 1;
    }
    if (37 in keys && keys[37] || 65 in keys && keys[65]) { //left
        moveVec[0] -= 1;
    }
    if (39 in keys && keys[39] || 68 in keys && keys[68]) { //right
        moveVec[0] += 1;
    }

    if (moveVec[0] || moveVec[1]) {
        moveOrGlidePlayer(vecnorm(moveVec), dt);
    }
}

function moveOrGlidePlayer(dir, dt) {
    if (!tryMovePlayer(dir, dt)) {
        if (typeof lastCollidedLineSegment !== "undefined" && lastCollidedLineSegment !== false) {
            var v = vecnorm(vecsub(lastCollidedLineSegment[0], lastCollidedLineSegment[1])),
                w = vecnorm(vecsub(lastCollidedLineSegment[1], lastCollidedLineSegment[0]));
            var moved = false;

            // Try moving along the gradient of the line
            if (vecdot(v, dir) > vecdot(w, dir)) {
                moved |= tryMovePlayer(v, dt);
            } else {
                moved |= tryMovePlayer(w, dt);
            }

            // Try moving perpendicularly
            if (!moved) {
                moved |= tryMovePlayer(vecperp(dir), dt) ? true : tryMovePlayer(vecinv(vecperp(dir)), dt);
            }
        }
    }
}

function tryMovePlayer(dir, dt) {
    var sm = dt * pl.speed * scale;

    if (!testPointCollides(unscaleCoords([pl.x + dir[0] * sm, pl.y + dir[1] * sm]), pl.size * 1.2)) {
        pl.x += dir[0] * sm;
        pl.y += dir[1] * sm;
        return true;
    }
    return false;
}

function playerShoot() {
    var now = new Date().getTime();
    if (now - pl.lastFire > pl.bulletType.cooldown) {
        pl.lastFire = now;
        spawnBullet(playerScaledWorldPos(), screenToWorldScaled([mouse.x, mouse.y]), pl.bulletType, playerShoot, false);
        playSound(pl.bulletType.sound);
    }
}

function playerWorldPos() {
    return [
        pl.x + canvasW / 2,
        pl.y + canvasH / 3 * 2
    ];
}


function playerScaledWorldPos() {
    return [
        (pl.x + canvasW / 2) / scale,
        (pl.y + canvasH / 3 * 2) / scale
    ];
}


function drawPlayer(dt) {
    if (typeof drawPlayer.phase == 'undefined') {
        drawPlayer.phase = 0;
    }

    var x = canvasW / 2;
    var y = canvasH / 3 * 2;
    var ri = 0;
    var ro = pl.size * scale;
    var hpPerc = 1 - Math.max(0, pl.hp / pl.fullHp);

    drawPlayer.phase += 0.012 * dt;

    var grd = ctx.createRadialGradient(x, y, ri, x, y, ro);
    grd.addColorStop(0, "#000");
    grd.addColorStop(0.4 + Math.cos(drawPlayer.phase) / 50, "#0000AA");

    r = 170 + Math.floor(hpPerc * 85); g = 170 - Math.floor(hpPerc * 170); b = 255 - Math.floor(hpPerc * 150);
    grd.addColorStop(0.5 + Math.sin(drawPlayer.phase) / 40, "rgb(" + r + "," + g + "," + b + ")");
    grd.addColorStop(0.7 + Math.cos(drawPlayer.phase) / 20, "#0000FF");

    //r = Math.floor(0 + hpPerc * 128); g = 0; b = 32;
    //grd.addColorStop(0.9, "rgb(" + r + "," + g + "," + b + ")");
    if (hasHealShield()) {
        grd.addColorStop(0.9 + Math.cos(drawPlayer.phase) / 20, "#8B7500");
        grd.addColorStop(1.0, "#000022");

    } else {
        grd.addColorStop(0.9, "#000022");
    }

    //#8B7500
    //#00C5CD

    // Fill with gradient
    ctx.beginPath();
    ctx.arc(x, y, ro, 0, 2 * Math.PI, false);
    ctx.fillStyle = grd;
    ctx.fill();
}

function hasHealShield() {
    return new Date().getTime() - pl.lastHealTime < pl.healShieldTime;
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

function updateScore(dt) {
    var now = new Date().getTime();
    if (pl.y < pl.ly) {
        pl.score += (pl.ly - pl.y) * pl.multiplier;
        pl.scoreState = ScoreState.GAINING;
        pl.lastScoreGainTime = now;
        floorArrows.isOn = false;
    } else if (pl.y > pl.ly) {
        pl.score -= (pl.y - pl.ly) * 1.2;
        pl.scoreState = ScoreState.LOSING_FAST;
    } else {
        pl.score -= dt / 100;
        pl.scoreState = ScoreState.LOSING;
    }
    if (now - playStartTime > 4000 && now - pl.lastScoreGainTime > 1000) {
        floorArrows.start();
    }

    if (pl.score < 0) {
        pl.score = 0;
    }
}

function playerTakeHit(damage) {
    var now = new Date().getTime();

    if (damage < 0) {
        pl.hp -= damage;
        pl.lastHealTime = now;
        playSound("wee");
    } else if (damage > 0 && ! hasHealShield()) {
        pl.hp -= damage;
        pl.lastDamageTime = now;
        playSound("ouch");
    }

    if (pl.hp > pl.fullHp) {
        pl.hp = pl.fullHp;
    } else if (pl.hp < 0) {
        pl.hp = 0;
    }
}

function playerKilledEnemy() {
    pl.multiplier += 1;
    pl.lastMultiplierIncreaseTime = new Date().getTime();
}