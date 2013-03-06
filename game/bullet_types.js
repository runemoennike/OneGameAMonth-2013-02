
var BulletType = {
    BANANA: {
        speed: 2,
        cooldown: 50,
        lifeTime: 600,
        damage: 1,
        sound: "trdr",
        launchAngle: function (state) {
            if (typeof state.bullet_inited === "undefined" || state.bullet_inited != "BANANA") {
                state.bullet_inited = "BANANA";
                state.flip = true;
            }
            return (state.flip = !state.flip) ? 0.5 + Math.random() * 0.2 : -0.5 - Math.random() * 0.2;
        },
        spawned: function (b) {
            //b.lifeTime = veclen(vecsub(b.target, b.pos));
            b.target = vecadd(b.pos, vecmulscalar(vecnorm(vecsub(b.target, b.pos)), 1000));
        },
        update: function (b) {
            var desiredDirection = vecsub(b.target, b.pos);
            b.direction = vecnorm(vecadd(vecmulscalar(b.direction, 1000), desiredDirection));
        },
        draw: function (b) {
            var x = b.pos[0],
                y = b.pos[1];
            var size = 5;

            var tailX = x - b.direction[0] * 50;
            var tailY = y - b.direction[1] * 50;
            ctx.strokeStyle = "#999966";
            ctx.lineWidth = size;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();
        }
    },
    BUTTERFLY: {
        speed: 2,
        cooldown: 50,
        lifeTime: 2000,
        damage: 1,
        sound: "trdr",
        launchAngle: function (state) {
            if (typeof state.bullet_inited === "undefined" || state.bullet_inited != "BUTTERFLY") {
                state.bullet_inited = "BUTTERFLY";
                state.flip = true;
            }
            return (state.flip = !state.flip) ? 0.5 + Math.random() * 0.2 : -0.5 - Math.random() * 0.2;
        },
        spawned: function (b) {
        },
        update: function (b) {
            var desiredDirection = vecsub(b.target, b.pos);
            b.direction = vecnorm(vecadd(vecmulscalar(b.direction, 1000), desiredDirection));
        },
        draw: function (b) {
            var x = b.pos[0],
                y = b.pos[1];
            var size = 5;

            var tailX = x - b.direction[0] * 100;
            var tailY = y - b.direction[1] * 100;
            ctx.strokeStyle = "#666699";
            ctx.lineWidth = size;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();

            var r = g = Math.floor(150 + Math.random() * 50);
            var bl = 255;
            ctx.fillStyle = "rgb(" + r + "," + g + "," + bl + ")";
            ctx.fillRect(x - size / 2, y - size / 2, size, size);

        }
    },
    PEWPEW: {
        speed: 1.5,
        cooldown: 50,
        lifeTime: 2000,
        damage: 2,
        sound: "pewpewpew",
        launchAngle: function (state) {
            return 0;
        },
        spawned: function (b) {
        },
        update: function (b) {
        },
        draw: function (b) {
            var x = b.pos[0],
                y = b.pos[1];
            var size = 5;

            var tailX = x - b.direction[0] * 50;
            var tailY = y - b.direction[1] * 50;
            ctx.strokeStyle = "#FF0000";
            ctx.lineWidth = size;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();

        }
    },
    POWERUP_HEAL: {
        speed: 1,
        cooldown: 50,
        lifeTime: 20000,
        damage: -1,
        launchAngle: function (state) {
            return rndFloat(0, Math.PI * 2);
        },
        spawned: function (b) {
        },
        update: function (b) {
            var desiredDirection = vecsub(playerScaledWorldPos(), b.pos);
            b.direction = vecnorm(vecadd(vecmulscalar(b.direction, 1000), desiredDirection));
        },
        draw: function (b) {
            var x = b.pos[0],
                y = b.pos[1];
            var size = 10;

            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2 * Math.PI, false);
            ctx.fillStyle = '#EEC900';
            ctx.fill();
            ctx.strokeStyle = '#8B7500';
            ctx.stroke();
        }
    },
    EFFECT_HEXAGON_DEATH: {
        speed: 2,
        cooldown: 0,
        lifeTime: 1000,
        damage: 0,
        launchAngle: function (state) {
            return rndFloat(0, Math.PI * 2);
        },
        spawned: function (b) {
            var theta = rndFloat(-Math.PI, Math.PI);
            b.direction = [Math.cos(theta), Math.sin(theta)];
            b.speed = rndFloat(0.2, 2);
        },
        update: function (b) {
        },
        draw: function (b) {
            var size = 20,
                x = b.pos[0],
                y = b.pos[1];
            ctx.fillStyle = "#CC0000";


            //ctx.fillRect(x - size, y - size, size, size);
            ctx.beginPath();
            ctx.moveTo(x - size / 4, y - size / 2.3);
            ctx.lineTo(x - size / 2, y);
            ctx.lineTo(x - size / 4, y + size / 2.3);
            ctx.lineTo(x + size / 4, y + size / 2.3);
            ctx.lineTo(x + size / 2, y);
            ctx.lineTo(x + size / 4, y - size / 2.3);
            ctx.closePath();
            ctx.fill();
        }
    }
}