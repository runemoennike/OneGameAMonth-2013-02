
var BulletType = {
    BANANA: {
        speed: 2,
        cooldown: 50,
        lifeTime: 600,
        damage: 0.3,
        launchAngle: function (state) {
            if (typeof state.bullet_inited === "undefined" || state.bullet_inited != "BANANA") {
                state.bullet_inited = "BANANA";
                state.flip = true;
            }
            return (state.flip = !state.flip) ? 0.5 + Math.random() * 0.2 : -0.5 - Math.random() * 0.2;
        },
        spawned: function (b) {
            //b.lifeTime = veclen(vecsub(b.target, b.pos));
            b.target = vecadd(b.pos, vecmulscalar(vecnorm(vecsub(b.target, b.pos)), 1000 / scale));
        },
        update: function (b) {
            var desiredDirection = vecsub(b.target, b.pos);
            b.direction = vecnorm(vecadd(vecmulscalar(b.direction, 1000 * scale), desiredDirection));
        },
        draw: function (b) {
            var x = b.pos[0],
                y = b.pos[1];
            var size = Math.max(5, 5 * scale);

            var tailX = x - b.direction[0] * 50 * scale;
            var tailY = y - b.direction[1] * 50 * scale;
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
        damage: 0.5,
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
            var size = Math.max(5, 5 * scale);

            var tailX = x - b.direction[0] * 100 * scale;
            var tailY = y - b.direction[1] * 100 * scale;
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
        speed: 2,
        cooldown: 50,
        lifeTime: 2000,
        damage: 1,
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
            var size = Math.max(5, 5 * scale);

            var tailX = x - b.direction[0] * 50 * scale;
            var tailY = y - b.direction[1] * 50 * scale;
            ctx.strokeStyle = "#FF0000";
            ctx.lineWidth = size;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();

        }


    }
}