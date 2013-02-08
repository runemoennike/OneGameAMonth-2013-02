
var sfxPath = "sfx/";
var sfxManifest = [
    { src: sfxPath + "pulse.mp3|" + sfxPath + "pulse.ogg", id: "bgmusic_1", data: 1 },
    { src: sfxPath + "countdown.mp3|" + sfxPath + "countdown.ogg", id: "countdown", data: 1 },
    { src: sfxPath + "deathnoise.mp3|" + sfxPath + "deathnoise.ogg", id: "deathnoise", data: 1 },
];

function playSound(id) {
    //Play the sound: play (src, interrupt, delay, offset, loop, volume, pan)
    var instance = createjs.SoundJS.play(id, createjs.SoundJS.INTERRUPT_ANY, 0, 0, false, 1);
    if (instance == null || instance.playState == createjs.SoundJS.PLAY_FAILED) { return; }
}

