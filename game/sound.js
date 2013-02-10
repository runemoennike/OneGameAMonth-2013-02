
var sfxPath = "sfx/";
var sfxManifest = [
    { src: sfxPath + "pulse.mp3|" + sfxPath + "pulse.ogg", id: "bgmusic_1", data: 1 },
    { src: sfxPath + "countdown.mp3|" + sfxPath + "countdown.ogg", id: "countdown", data: 1 },
    { src: sfxPath + "deathnoise.mp3|" + sfxPath + "deathnoise.ogg", id: "deathnoise", data: 1 },
    { src: sfxPath + "pewpewpew.mp3|" + sfxPath + "pewpewpew.ogg", id: "pewpewpew", data: 1 },
];

var sndLevels = {
    "pewpewpew": 0.2
}

function playSound(id) {
    //Play the sound: play (src, interrupt, delay, offset, loop, volume, pan)
    var volume = (typeof sndLevels[id] !== "undefined") ? sndLevels[id] : 1;
    var instance = createjs.SoundJS.play(id, createjs.SoundJS.INTERRUPT_ANY, 0, 0, false, volume);
    if (instance == null || instance.playState == createjs.SoundJS.PLAY_FAILED) { return; }
}

