var MAX_BULLETS = 1000;
var bullets = new Array(MAX_BULLETS);


function spawnBullet(pos, target, type, stateObj, hostile) {
    var idx = -1;
    for (var i = 0; i < MAX_BULLETS; i++) {
        if (typeof bullets[i] === 'undefined' || bullets[i] === false) {
            idx = i;
            break;
        }
    }

    if (idx == -1) {
        return;
    }

    var angle = type.launchAngle(stateObj);
    var bullet = {
        pos: pos,
        target: target,
        direction: vecrot(vecnorm(vecsub(target, pos)), angle),
        type: type,
        startTime: new Date().getTime(),
        lifeTime: type.lifeTime,
        hostile: hostile
    }

    type.spawned(bullet);

    bullets[i] = bullet;
}

function updateBullets(dt) {
    var now = new Date().getTime();
    var c = 0;
    for (var i = 0; i < MAX_BULLETS; i++) {
        if (typeof bullets[i] !== 'undefined' && bullets[i] !== false) {
            c++;

            var b = bullets[i];
            vecaddto(b.pos, vecmulscalar(b.direction, b.type.speed * dt));

            b.type.update(b);
            
            if (b.hostile) {
                if (checkBulletVsPlayer(b)) {
                    bullets[i] = false;
                }
            } else {
                if (checkBulletVsEnemies(b)) {
                    bullets[i] = false;
                }
            }

            if (now - b.startTime > b.lifeTime || testPointInPolys(b.pos)) {
                bullets[i] = false;
            }

        }
    }

    document.getElementById("debug_bullets").innerHTML = c;
}

function drawBullets() {
    for (var i = 0; i < MAX_BULLETS; i++) {
        if (typeof bullets[i] !== 'undefined' && bullets[i] !== false) {
            bullets[i].type.draw(bullets[i]);
        }
    }
}

function checkBulletVsPlayer(b) {
    if (dist2(b.pos, playerScaledWorldPos()) < pl.size * pl.size * scale * scale) {
        playerTakeHit(b.type.damage);
        return true;
    }
    return false;
}

function checkBulletVsEnemies(b) {
    var e ;
    for(var i = 0; i < MAX_ENEMIES; i ++) {
        if (typeof enemies[i] !== 'undefined' && enemies[i] !== false) {
            e = enemies[i];
            if (dist2(b.pos, e.pos) < e.size * e.size * scale * scale / 2) {
                e.type.takeHit(e, b.type.damage);
                return true;
            }
        }
    }
    return false;
}