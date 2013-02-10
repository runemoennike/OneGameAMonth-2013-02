
var sfxPath = "sfx/";
var sfxManifest = [
    { src: sfxPath + "pulse.mp3|" + sfxPath + "pulse.ogg", id: "bgmusic_1", data: 1 },
    { src: sfxPath + "countdown.mp3|" + sfxPath + "countdown.ogg", id: "countdown", data: 1 },
    { src: sfxPath + "deathnoise.mp3|" + sfxPath + "deathnoise.ogg", id: "deathnoise", data: 1 },
    { src: sfxPath + "pewpewpew.mp3|" + sfxPath + "pewpewpew.ogg", id: "pewpewpew", data: 1 },
    { src: sfxPath + "blip.mp3|" + sfxPath + "blip.ogg", id: "blip", data: 1 },
    { src: sfxPath + "trdr.mp3|" + sfxPath + "trdr.ogg", id: "trdr", data: 1 },
];

var sndMeta = {
    "pewpewpew": { vol: 0.2, interrupt: createjs.SoundJS.INTERRUPT_NONE },
    "blip": { vol: 0.05, interrupt: createjs.SoundJS.INTERRUPT_ANY },
    "trdr": { vol: 0.9, interrupt: createjs.SoundJS.INTERRUPT_ANY },
    "bgmusic_1": { vol: 1, interrupt: createjs.SoundJS.INTERRUPT_ANY },
    "countdown": { vol: 1, interrupt: createjs.SoundJS.INTERRUPT_ANY },
}

function playSound(id) {
    //Play the sound: play (src, interrupt, delay, offset, loop, volume, pan)
    var instance = createjs.SoundJS.play(id, sndMeta[id].interrupt, 0, 0, false, sndMeta[id].vol);
    if (instance == null || instance.playState == createjs.SoundJS.PLAY_FAILED) { return; }
}