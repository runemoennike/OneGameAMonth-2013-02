
var sfxPath = "sfx/";
var sfxManifest = [
    { src: sfxPath + "pulse.mp3|" + sfxPath + "pulse.ogg", id: "bgmusic_1", data: 1 },
    { src: sfxPath + "countdown.mp3|" + sfxPath + "countdown.ogg", id: "countdown", data: 1 },
    { src: sfxPath + "deathnoise.mp3|" + sfxPath + "deathnoise.ogg", id: "deathnoise", data: 1 },
    { src: sfxPath + "pewpewpew.mp3|" + sfxPath + "pewpewpew.ogg", id: "pewpewpew", data: 1 },
    { src: sfxPath + "blip.mp3|" + sfxPath + "blip.ogg", id: "blip", data: 1 },
    { src: sfxPath + "trdr.mp3|" + sfxPath + "trdr.ogg", id: "trdr", data: 1 },
    { src: sfxPath + "pfs.mp3|" + sfxPath + "pfs.ogg", id: "pfs", data: 1 },
    { src: sfxPath + "pling.mp3|" + sfxPath + "pling.ogg", id: "pling", data: 1 },
    { src: sfxPath + "wee.mp3|" + sfxPath + "wee.ogg", id: "wee", data: 1 },
    { src: sfxPath + "ouch.mp3|" + sfxPath + "ouch.ogg", id: "ouch", data: 1 },
    { src: sfxPath + "win.mp3|" + sfxPath + "win.ogg", id: "win", data: 1 },
];

var sndMeta = {
    "pewpewpew": { vol: 0.2, interrupt: createjs.Sound.INTERRUPT_NONE, loop: false, offset: 0 },
    "blip": { vol: 0.05 , interrupt: createjs.Sound.INTERRUPT_ANY, loop: false, offset: 0 },
    "trdr": { vol: 0.9, interrupt: createjs.Sound.INTERRUPT_ANY, loop: false, offset: 0 },
    "bgmusic_1": { vol: 1, interrupt: createjs.Sound.INTERRUPT_ANY, loop: false, offset: 0 },
    "countdown": { vol: 1, interrupt: createjs.Sound.INTERRUPT_ANY, loop: false, offset: 0 },
    "pfs": { vol: 1, interrupt: createjs.Sound.INTERRUPT_ANY, loop: false, offset: 0 },
    "deathnoise": { vol: 0.8, interrupt: createjs.Sound.INTERRUPT_NONE, loop: true, offset: 50 },
    "pling": { vol: 1, interrupt: createjs.Sound.INTERRUPT_ANY, loop: false, offset: 0 },
    "wee": { vol: 0.8, interrupt: createjs.Sound.INTERRUPT_NONE, loop: false, offset: 0 },
    "ouch": { vol: 0.8, interrupt: createjs.Sound.INTERRUPT_ANY, loop: false, offset: 0 },
    "win": { vol: 1, interrupt: createjs.Sound.INTERRUPT_ANY, loop: false, offset: 0 },
}

function playSound(id) {
    //Play the sound: play (src, interrupt, delay, offset, loop, volume, pan)
    var instance = createjs.Sound.play(id, sndMeta[id].interrupt, 0, sndMeta[id].offset, sndMeta[id].loop, sndMeta[id].vol);
    if (instance == null || instance.playState == createjs.Sound.PLAY_FAILED) { return; }
}
