class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion_1', './assets/Hit_Hurt.wav');
        this.load.audio('sfx_explosion_2', './assets/Hit_Hurt2.wav');
        this.load.audio('sfx_explosion_3', './assets/Hit_Hurt3.wav');
        this.load.audio('sfx_explosion_4', './assets/Hit_Hurt4.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        this.load.image('titleScreen', './assets/titleScreen.png');
    }

    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Comic Sans MS	',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#000',
            align: 'right',
            padding: {
            left: 5,
            right: 5,
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }
        // show menu text
        this.titleScreen = this.add.tileSprite(0,0,640,480, 'titleScreen').setOrigin(0,0);
        this.add.text(game.config.width * .25, game.config.height *.25 - borderUISize - borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#FFFF00';
        this.add.text(game.config.width*.70, game.config.height *.55, 'Use ←→ arrows to move', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width*.70, game.config.height*.45, 'Instructions:', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width*.70, game.config.height*.65, '& F to Fire', menuConfig).setOrigin(0.5);
        
        
        menuConfig.backgroundColor = '#00FF00';
        this.add.text(game.config.width * .25,game.config.height*.26, 'High Score: ' + highScore, menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#F3B141';
        this.add.text(game.config.width/2, game.config.height*.70 + borderUISize + borderPadding, 'To Start: Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);
        
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // easy mode
          game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 30000    
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // hard mode
          game.settings = {
            spaceshipSpeed: 5,
            gameTimer: 20000    
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene');    
        }
      }
}
