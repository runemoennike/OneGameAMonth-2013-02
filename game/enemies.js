var MAX_ENEMIES = 10;
var enemies = new Array(MAX_ENEMIES);
var numEnemies = 0;


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
        dir: vecnorm([rndFloat(-1, 1), rndFloat(-1,1)]),
        type: type,
        size: type.size,
        startTime: new Date().getTime(),
        speed: type.speed,
        hp: type.fullHp
    }

    type.spawned(enemy);

    enemies[i] = enemy;
    return i;
}

function updateEnemies(dt) {
    var now = new Date().getTime();
    var c = 0;
    for (var i = 0; i < MAX_ENEMIES; i++) {
        if (typeof enemies[i] !== 'undefined' && enemies[i] !== false) {
            c++;

            var e = enemies[i];
            if (!tryMoveEnemy(e, dt)) {
                e.type.collided(e);
            }

            e.type.update(e);

            if (dist2(e.pos, playerScaledWorldPos()) > 4000 * 4000 * scale) {
                enemies[i].type.purged(e);
                enemies[i] = false;
            } else if (e.hp <= 0) {
                enemies[i].type.died(e);
                enemies[i].type.purged(e);
                enemies[i] = false;
            }
        }
    }

    numEnemies = c;
    document.getElementById("debug_enemies").innerHTML = c;

    if (numEnemies < MAX_ENEMIES) {
        spawnRandomEnemy();
    }
}

function spawnRandomEnemy() {
    var plPos = playerScaledWorldPos();
    var type = EnemyType.HEXAGON;

    if (type.currentlyActive < type.maxActive) {
        for (var i = 0; i < 10; i++) {
            var theta = rndFloat(-Math.PI, Math.PI),
                r = rndInt(1000 * scale, 3000 * scale);
            var pos = [plPos[0] + Math.cos(theta) * r,
                        plPos[1] + Math.sin(theta) * r];

            if (!testPointInPolys(pos) && !testPointCollides(pos, type.size * 1.2)) {
                spawnEnemy(pos, type);

                
                break;
            }
        }
    }
}

function tryMoveEnemy(e, dt) {
    var sm = dt * e.speed * scale;

    if (!testPointCollides([e.pos[0] + e.dir[0] * sm, e.pos[1] + e.dir[1] * sm], e.size * 1.2)) {
        vecaddto(e.pos, vecmulscalar(e.dir, sm));
        return true;
    }
    return false;
}

function drawEnemies(dt) {
    for (var i = 0; i < MAX_ENEMIES; i++) {
        if (typeof enemies[i] !== 'undefined' && enemies[i] !== false) {
            enemies[i].type.draw(enemies[i], dt);
        }
    }
}