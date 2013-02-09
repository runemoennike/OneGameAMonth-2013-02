var MAX_BULLETS = 1000;
var bullets = new Array(MAX_BULLETS);


function spawnBullet(pos, target, type, stateObj) {
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
        lifeTime: type.lifeTime
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

            if (now - b.startTime > b.lifeTime) {
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