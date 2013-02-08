
var BulletType = {
    PLAYER_STD: {
        speed: 2,
        cooldown: 50,
        launchAngle: function (state) {
            if (typeof state.bullet_inited === "undefined" || state.bullet_inited != "PLAYER_STD") {
                state.bullet_inited = "PLAYER_STD";
                state.flip = true;
            }
            return (state.flip = !state.flip) ? 0.5 : -0.5;
        },
        update: function (b) {
            var desiredDirection = vecsub(b.target, b.pos);
            b.direction = vecnorm(vecadd(vecmulscalar(b.direction, 1000), desiredDirection));
        },
        draw: function (b) {
            var r = g = Math.floor(150 + Math.random() * 50);
            var bl = 255;
            ctx.fillStyle = "rgb(" + r + "," + g + "," + bl + ")";
            var x = b.pos[0],
                y = b.pos[1];
            ctx.fillRect(x - 5, y - 5, 5, 5);
        },
        lifeTime: 2000
    }
}