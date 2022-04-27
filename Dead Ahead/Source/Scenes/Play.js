class Play extends Phaser.Scene
{
    constructor()
    {
        super("playScene");
    }
    //--------------------------------------------------------------------------
    // PRELOAD
    //--------------------------------------------------------------------------
    preload()
    {
        // load images/tile sprites
        this.load.image('car', './assets/car.png');
        this.load.image('zombie', './assets/zombie.png');
        this.load.image('road', './assets/road.png');

        // load spritesheet for death animation
        this.load.spritesheet
        (
            "explosion",
            "./Assets/explosion.png",
            {
                frameWidth: 64,
                frameHeight: 32,
                startFrame: 0,
                endFrame: 9
            }
        );
    } 
    //-end preload()------------------------------------------------------------
    //--------------------------------------------------------------------------
    // CREATE
    //--------------------------------------------------------------------------
    create()
    {

        //----------------------------------------------------------------------
        // configure the user interface
        // place tile sprite background
        this.road = this.add.tileSprite
        (
            0, 0, 640, 480, 'road'
        ).setOrigin(0, 0);

        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00ff00).setOrigin(0, 0);

        //----------------------------------------------------------------------
        // add in the game objects
        // add player (p1)
        this.player = new Player
        (
            this, // scene
            game.config.width/2, // x-coord
            400, // y-coord
            "car", // texture
            0, // frame
        ).setScale(0.5, 0.5).setOrigin(0, 0);

        // m is multiplier on how far zombie 2 is from zombie 1. Useful if we are moving roads
        var m = 81;
        // min/max value on zombie spawns
        var min = -50;
        var max = -1000;
        // add zombie 1
        this.zombie1 = new Zombie
        (this, 107, -50, 'zombie', Phaser.Math.Between(min, max), 10).setOrigin(0, 0);

        // add zombie 2
        this.zombie2 = new Zombie
        (this, this.zombie1.x + m, Phaser.Math.Between(min, max), 'zombie', 0, 10).setOrigin(0, 0);

        // add zombie 3
        this.zombie3 = new Zombie
        (this, this.zombie1.x + m*2, Phaser.Math.Between(min, max), 'zombie', 0, 10).setOrigin(0, 0);

        this.zombie4 = new Zombie
        (this, this.zombie1.x + m*3, Phaser.Math.Between(min, max), 'zombie', 0, 10).setOrigin(0, 0);

        this.zombie5 = new Zombie
        (this, this.zombie1.x + m*4, Phaser.Math.Between(min, max), 'zombie', 0, 10).setOrigin(0, 0);

        this.zombie6 = new Zombie
        (this, this.zombie1.x + m*5, Phaser.Math.Between(min, max), 'zombie', 0, 10).setOrigin(0, 0);

        //----------------------------------------------------------------------
        // add the user input
        // define mouse controls
        //mouse = this.input;
        // define keyboard keys
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);


        //----------------------------------------------------------------------
        // add the animations
        // animation config for zombie explosions
        this.anims.create
        (
            {
                key: "explode", //
                frames: this.anims.generateFrameNumbers
                (
                    "explosion", // key
                    { // configuration object
                        start: 0,
                        end: 9,
                        first: 0
                    }
                ),
                frameRate: 30
            }
        );

        //----------------------------------------------------------------------
        // add the UI text
        // player score updates during play
        this.p1Score = 0;
        // high score is saved across games played
        this.hScore = parseInt(localStorage.getItem("score")) || 0;
        // scores display configuration
        let scoreConfig =
        {
            fontFamily: "Courier",
            fontSize: "20px",
            backgroundColor: "#f3b141",
            color: "#843605",
            align: "left",
            padding: {top: 5, bottom: 5},
            fixedWidth: 150
        };
        this.scoreLeft = this.add.text
        (
            50, // x-coord
            54, // y-coord
            "Score: " + this.p1Score, // initial text
            scoreConfig // config settings
        );

        this.p1Lives = game.settings.playerSpeed;
        this.lives = this.add.text
        (
            225, // x-coord
            54, // y coord
            "Lives: " + this.p1Lives, // initial text
            scoreConfig // config settings
        );

        // this timer will indicate how much longer until player reaches checkpoint
        this.gameClock = game.settings.gameTimer;
        this.ampm = game.settings.apm;
        
        // create an object to populate the text configuration members
        let gameClockConfig =
        {
            fontFamily: "Courier",
            fontSize: "20px",
            backgroundColor: "#f3b141",
            color: "#843605",
            align: "left",
            padding: {top: 5, bottom: 5},
            fixedWidth: 200
        };
        // add the text to the screen
        this.timeLeft = this.add.text
        (
            400, // x-coord
            54, // y-coord
            "Time: " + this.formatTime(this.gameClock) + this.ampm, // text to display
            gameClockConfig // text style config object
        );
        // add the event to increment the clock
        // code adapted from:
        //  https://phaser.discourse.group/t/countdown-timer/2471/3
        this.timedEvent = this.time.addEvent
        (
            {
                delay: 7500,
                callback: () =>
                {
                    this.gameClock += 15000; 
                    this.timeLeft.text = "Time: " + this.formatTime(this.gameClock) + this.ampm;
                },
                scope: this,
                loop: true
            }
        );
        
        this.gasTimer = game.settings.gasTimer;
        this.gas = game.settings.gas;

        this.gasTime = this.time.addEvent
        (
            {
                delay: 1000,
                callback: () =>
                {
                    this.gasTimer++;
                    console.count("player time is " + this.gas);
                },
                scope: this,
                loop: true
            }
        );

        this.gas = this.add.text
        (
            225, // x-coord
            80, // y coord
            "Gas: " + this.gasTimer, // initial text
            scoreConfig // config settings
        );
        //----------------------------------------------------------------------
        // game over event
        this.gameOver = false;
        // checkpoint event
        this.checkpoint = false;
        // 60s play clock
        scoreConfig.fixedWidth = 0;
    }
    // end create() ------------------------------------------------------------
    //--------------------------------------------------------------------------
    // UPDATE
    //--------------------------------------------------------------------------
    update()
    {
        
        // generally updates every frame

        // when game is over remove the game clock event
        if(this.gameOver) {
            this.time.removeAllEvents();
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER').setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu').setOrigin(0.5);
        }

        // check for key input to restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR))
        {
            this.scene.restart(this.p1Score);
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyM))
        {
            this.scene.start("menuScene");
        }

        if(!this.gameOver)
        {
            // update tile sprite
            this.road.tilePositionY -= this.p1Lives;  
            // update player
            this.player.update(this.p1Lives);
            // update zombie 1
            this.zombie1.update(1, this.p1Lives); //parameter 1 is default speed factor
            // update zombie 2
            this.zombie2.update(1, this.p1Lives);
            // update zombie 3
            this.zombie3.update(1, this.p1Lives);
            // update zombie 4
            this.zombie4.update(1, this.p1Lives); 
            // update zombie 5
            this.zombie5.update(1, this.p1Lives);
            // update zombie 6
            this.zombie6.update(1, this.p1Lives);
            
            //switches clock from AM to PM
            if(this.gameClock >= 780000){
                if(this.ampm == 'pm'){
                    this.ampm = 'am'
                }
                if(this.ampm == 'am'){
                    this.ampm = 'pm'
                }
                this.gameClock = 60000;
                this.timeLeft.text = "Time: " + this.formatTime(this.gameClock) + this.ampm;
            }
            if (this.gameClock >= 36000 & this.ampm == 'am') {
                this.gameOver = true;
            }
        }

        // if a player avoids zombies for 15 seconds, they consume gas
        if(this.gasTimer == 15){
            this.consumeGas(this.player);
        }

        // check for collisions
        if(this.checkCollision(this.player, this.zombie1))
        {
            this.player.reset();
            this.zombieKill(this.zombie1);
        }

        if(this.checkCollision(this.player, this.zombie2))
        {
            this.player.reset();
            this.zombieKill(this.zombie2);
        }

        if(this.checkCollision(this.player, this.zombie3))
        {
            this.player.reset();
            this.zombieKill(this.zombie3);
        }

        if(this.checkCollision(this.player, this.zombie4))
        {
            this.player.reset();
            this.zombieKill(this.zombie4);
        }

        if(this.checkCollision(this.player, this.zombie5))
        {
            this.player.reset();
            this.zombieKill(this.zombie5);
        }

        if(this.checkCollision(this.player, this.zombie6))
        {
            this.player.reset();
            this.zombieKill(this.zombie6);
        }
    }
    //-end update()-------------------------------------------------------------
    //--------------------------------------------------------------------------
    // COLLISIONS
    //--------------------------------------------------------------------------
    //
    checkCollision(player, zombie)
    {
        // simple AABB bounds checking
        if
        (
            player.x - 0 < zombie.x + zombie.width && // left side hitbox
            player.x - 26 + player.width > zombie.x && //right side hitbox
            player.y < zombie.y + zombie.height &&
            player.height + player.y > zombie.y
        ) return true;

        else return false;
    }

    zombieKill(zombie)
    {
        this.gasTimer = 0;
        zombie.alpha = 0; // set zombie to be fully transparent
        zombie.y = Phaser.Math.Between(-50, -1000); // reset zombie position
        zombie.alpha = 1; // set zombie to be fully visible

        // score increment and repaint
        this.p1Score += zombie.points;
        // update the high score if needed
        
        this.scoreLeft.text = "Score: " + this.p1Score;

        this.p1Lives -= 1;
        this.lives.text = "Lives: " + this.p1Lives;

        if (this.p1Lives <= 0) {
            this.gameOver = true;
        }
    }

    consumeGas(player){
        this.gasTimer = 0;
        this.gas--;
        this.p1Lives += 2;
        this.lives.text = "Lives: " + this.p1Lives;
        if(this.gas <= 0){
            this.gameOver = true;
        }
    }

    formatTime(ms)
    {
        let s = ms/1000;
        let min = Math.floor(s/60);
        let seconds = s%60;
        seconds = seconds.toString().padStart(2, "0");
        return `${min}:${seconds}`;
    }
}

