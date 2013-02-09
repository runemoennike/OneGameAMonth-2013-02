
var BulletType = {
    PLAYER_STD: {
        speed: 2,
        cooldown: 50,
        lifeTime: 2000,
        launchAngle: function (state) {
            if (typeof state.bullet_inited === "undefined" || state.bullet_inited != "PLAYER_STD") {
                state.bullet_inited = "PLAYER_STD";
                state.flip = true;
            }
            return (state.flip = !state.flip) ? 0.5 + Math.random() * 0.2 : -0.5 - Math.random() * 0.2;
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
            ctx.strokeStyle = "#333366";
            ctx.lineWidth = size;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();

            var r = g = Math.floor(150 + Math.random() * 50);
            var bl = 255;
            ctx.fillStyle = "rgb(" + r + "," + g + "," + bl + ")";
            ctx.fillRect(x - size, y - size, size, size);

        }
    }
}