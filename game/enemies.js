var MAX_ENEMIES = 10;
var enemies = new Array(MAX_ENEMIES);


function spawnEnemy(pos, type) {
    var idx = -1;
    for (var i = 0; i < MAX_ENEMIES; i++) {
        if (typeof enemies[i] === 'undefined' || enemies[i] === false) {
            idx = i;
            break;
        }
    }

    if (idx == -1) {
        return;
    }

    var enemy = {
        pos: pos,
        direction: vecnorm([rndFloat(-1, 1), rndFloat(-1,1)]),
        type: type,
        size: type.size,
        startTime: new Date().getTime(),
    }

    type.spawned(enemy);

    enemies[i] = enemy;
}

function updateEnemies(dt) {
    var now = new Date().getTime();
    var c = 0;
    for (var i = 0; i < MAX_ENEMIES; i++) {
        if (typeof enemies[i] !== 'undefined' && enemies[i] !== false) {
            c++;

            var e = enemies[i];
            if (!tryMoveEnemy(e, dt)) {
                e.type.collided(b);
            }

            e.type.update(b);

            if (dist2(e.pos, [pl.x, pl.y]) > 2000 * scale) {
                enemies[i] = false;
            }
        }
    }

    document.getElementById("debug_enemies").innerHTML = c;
}

function tryMoveEnemy(e, dt) {
    var sm = dt * e.speed * scale;

    if (!testPointCollides([e.pos[0] + e.dir[0] * sm, e.pos[1] + e.dir[1] * sm], e.size * 1.2)) {
        vecaddto(b.pos, vecmulscalar(dir, sm));
        return true;
    }
    return false;
}

function drawEnemies() {
    for (var i = 0; i < MAX_ENEMIES; i++) {
        if (typeof enemies[i] !== 'undefined' && enemies[i] !== false) {
            enemies[i].type.draw(enemies[i]);
        }
    }
}