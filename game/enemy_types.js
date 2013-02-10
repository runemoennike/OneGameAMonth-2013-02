
var EnemyType = {
    HEXAGON: {
        speed: 0.3,
        size: 80,
        fullHp: 10,
        spawned: function (e) {
            var now = new Date().getTime();
            e.lastDirChangeTime = now;
            e.lastTimeBarrage = now;
            e.lastTimeShoot = now;
            e.shootInterval = 100;
            e.barrageInterval = 1000 + rndInt(0, 1000);
            e.barrageCount = 0;
        },
        update: function (e, dt) {
            var now = new Date().getTime();
            if (now - e.lastDirChangeTime > 2000) {
                e.dir = vecnorm([rndFloat(-1, 1), rndFloat(-1, 1)]);
                e.lastDirChangeTime = now;
                playSound("blip");
            }

            if (now - e.lastTimeBarrage > e.barrageInterval) {
                e.barrageCount = 0;
                e.lastTimeBarrage = now;
                playSound(BulletType.PEWPEW.sound);
            }

            if (e.barrageCount < 3 && now - e.lastTimeShoot > e.shootInterval) {
                spawnBullet([e.pos[0], e.pos[1]], playerScaledWorldPos(), BulletType.PEWPEW, e, true);
                e.lastTimeShoot = now;
                e.barrageCount++;
            }
        },
        collided: function (e) {
            e.dir = vecnorm([rndFloat(-1, 1), rndFloat(-1, 1)]);
        },
        draw: function (e, dt) {
            var now = new Date().getTime();
            var x = e.pos[0],
                y = e.pos[1];
            var size = e.size;

            var r = 25 + Math.floor((now - e.lastTimeBarrage) / e.barrageInterval * 150);
            var g = bl = 0;
            ctx.fillStyle = "rgb(" + r + "," + g + "," + bl + ")";
            
            var hpPerc = (1.0 - e.hp / e.type.fullHp);
            r = 255;
            g = bl = Math.floor(hpPerc * 255);
            ctx.strokeStyle = "rgb(" + r + "," + g + "," + bl + ")";

            ctx.lineWidth = Math.max(1, 30 * scale - hpPerc * 30 * scale);
            //ctx.fillRect(x - size, y - size, size, size);
            ctx.beginPath();
            ctx.moveTo(x - size / 4, y - size / 2.3);
            ctx.lineTo(x - size / 2, y);
            ctx.lineTo(x - size / 4, y + size / 2.3);
            ctx.lineTo(x + size / 4, y + size / 2.3);
            ctx.lineTo(x + size / 2, y);
            ctx.lineTo(x + size / 4, y - size / 2.3);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();

            var eyeSize = Math.max(5, 10 * scale),
                eyeDir = vecnorm(vecsub(playerScaledWorldPos(), e.pos));
            ctx.fillStyle = "#FF0000";
            ctx.fillRect(x + eyeDir[0] * 35 * scale - eyeSize / 2, y + eyeDir[1] * 35 * scale - eyeSize / 2, eyeSize, eyeSize);

        },
        takeHit: function (e, damage) {
            e.hp -= damage;
        }
    },
}