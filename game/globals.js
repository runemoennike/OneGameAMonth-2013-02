﻿
var GameState = { COUNTDOWN: 1, PLAYING: 2, DEAD: 3, WON: 4 }
var ScoreState = { GAINING: 1, LOSING: 2, LOSING_FAST: 3 }


var body;
var canvas;
var ctx;
var canvasW, canvasH;
var scale;
var rafId;

var fast = true;
var noClip = false;

var gamestate = GameState.COUNTDOWN;
var playStartTime;
var playLength = (3 * 60 + 6) * 1000;

var countDown = {
    isOn: true,
    length: 1200,
    phaseStart: 0,
    value: 3
}

var floorArrows = {
    isOn: false,
    length: 2000,
    startTime: 0,

    start: function () {
        floorArrows.isOn = true;
        floorArrows.startTime = new Date().getTime();
    }
}