class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('asteroid', './assets/asteroid.png');
        this.load.image('spaceship2', './assets/spaceship2.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('ground', './assets/ground.png');
        this.load.image('flares', './assets/flares.png');
        this.load.audio('sfx_bg', './assets/bg.mp3');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        this.music = this.sound.play('sfx_bg', {loop: true});
        // place tile sprite
        this.starfield = this.add.tileSprite(0,0,640,480, 'starfield').setOrigin(0,0);
        this.ground = this.add.tileSprite(0,0,640,480, 'ground').setOrigin(0,0);
        this.meteor = this.add.tileSprite(0,200,100,100,'asteroid').setOrigin(0,0);
        
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
    
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0); 
    
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // add spaceships (x4)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*8 + borderPadding*4, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        this.ship04 = new Spaceship(this, game.config.width - borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship2', 0, 40).setOrigin(0,0);
        this.ship04.moveSpeed = this.ship03.moveSpeed *2;
        
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
              
        // initialize score
        this.p1Score = 0;

         // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
       
        // GAME OVER flag
        this.gameOver = false;
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        // Adds high score, Fire UI, and time text
        this.highScoreText = this.add.text(game.config.width * 0.75, borderUISize + borderPadding*2, 'HS: ' + highScore, scoreConfig);
        this.fireUI = this.add.text(game.config.width * 0.50, borderUISize + borderPadding*2, 'Fire', scoreConfig);
        this.timeElapsed = this.add.text(game.config.width * 0.25, borderUISize + borderPadding*2, 'Time: ' + Phaser.Math.RoundTo(this.clock.elapsed/1000,2, 1), scoreConfig);
    }

    update() {
        var remaining_time = (this.game.settings.gameTimer/1000) - Phaser.Math.RoundTo(this.clock.elapsed/1000,2, 1);
        this.timeElapsed.setText('Time: ' + remaining_time);

        if(this.p1Score > highScore) { 
            highScore = this.p1Score; 
            this.highScoreText.setText('HS: ' + highScore);
        }
        
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        // wrap around from left edge to right edge
        if(this.meteor.x >= game.config.width+100) {
            this.meteor.x = -50;
        }

        if (!this.gameOver) {       
            this.starfield.tilePositionX -= 4;
            this.ground.tilePositionX -= .5;
            this.meteor.x += 3;
            this.meteor.angle += .5;        
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
            this.ship04.angle += 1; 
        } 
        else {  this.sound.get('sfx_bg').stop(); }
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03); 
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // this.emit_particles = false;
        this.particles = this.add.particles('flares');
        this.emitter = this.particles.createEmitter({
            speed: 200,
            lifespan: 500,
            blendMode: 'ADD',
            frequency: 50,
            maxParticles: 100,
            alpha: {start: 1, end: 0},
            scale: {start:.75, end:0}
        });
        this.particles.emitParticleAt(ship.x,ship.y,100);
        
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });       
        
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        var val = rnd.between(1,4);
        if(val == 1) this.sound.play('sfx_explosion_1');
        else if(val == 2) this.sound.play('sfx_explosion_2');
        else if(val == 3) this.sound.play('sfx_explosion_3');
        else this.sound.play('sfx_explosion_4');
        if(this.clock.elapsed >= 3000) {
            this.clock.elapsed = Phaser.Math.RoundTo(this.clock.elapsed - 3000,2, 1);
        }
        else { this.clock.elapsed = 0; }
    }
}