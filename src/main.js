// Ben Urlik
// Rocket Patrol Mod
// 04/19/21
// Work time: ~8-10 hours


// Point Breakdown
//--------------------------------------------------------
// Track a high score that persists across scenes and display it in the UI (5)
// Implement the 'FIRE' UI text from the original game (5)
// Add your own (copyright-free) background music to the Play scene (5)
// Create 4 new explosion SFX and randomize which one plays on impact (10)
// Display the time remaining (in seconds) on the screen (10)
// Create a new title screen (e.g., new artwork, typography, layout) (10)
// Implement parallax scrolling (10)
// Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (20)
// Implement a new timing/scoring mechanism that adds time to the clock for successful hits (20)
// Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship (20)
// --------------------------------------------------------

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let highScore = 0; 

var rnd = Phaser.Math.RND;

// reserve keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT;