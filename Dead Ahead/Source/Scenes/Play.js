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
        this.load.image('road', './assets/road-long.png');
        this.load.image('hud', './assets/hud.png');

        // rpm meter
        this.load.image('rpm0', './assets/rpm/dial-rpm00.png');
        this.load.image('rpm1', './assets/rpm/dial-rpm01.png');
        this.load.image('rpm2', './assets/rpm/dial-rpm02.png');
        this.load.image('rpm3', './assets/rpm/dial-rpm03.png');
        this.load.image('rpm4', './assets/rpm/dial-rpm04.png');
        this.load.image('rpm5', './assets/rpm/dial-rpm05.png');

        // mph meter
        this.load.image('mph0', './assets/mph/dial-mph00.png');
        this.load.image('mph1', './assets/mph/dial-mph01.png');
        this.load.image('mph2', './assets/mph/dial-mph02.png');
        this.load.image('mph3', './assets/mph/dial-mph03.png');
        this.load.image('mph4', './assets/mph/dial-mph04.png');
        this.load.image('mph5', './assets/mph/dial-mph05.png');
        this.load.image('mph6', './assets/mph/dial-mph06.png');
        this.load.image('mph7', './assets/mph/dial-mph07.png');
        this.load.image('mph8', './assets/mph/dial-mph08.png');
        this.load.image('mph9', './assets/mph/dial-mph09.png');
        this.load.image('mph10', './assets/mph/dial-mph10.png');

        // gas meter
        this.load.image('gas1', './assets/gas/dial-gas01.png');
        this.load.image('gas2', './assets/gas/dial-gas02.png');
        this.load.image('gas3', './assets/gas/dial-gas03.png');
        this.load.image('gas4', './assets/gas/dial-gas04.png');
        this.load.image('gas5', './assets/gas/dial-gas05.png');

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
            0, 0, game.config.width, game.config.height, 'road'
        ).setOrigin(0, 0);

        this.hud = this.add.image(game.config.width/2, game.config.height - 240, 'hud');

        this.rpm = this.add.image(game.config.width/2, game.config.height - 54, 'rpm0');
        this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph0');
        this.gasDial = this.add.image(game.config.width/2, game.config.height - 54, 'gas1');

        //----------------------------------------------------------------------
        // add in the game objects
        // add player (p1)
        this.player = new Player
        (
            this, // scene
            game.config.width/2, // x-coord
            game.config.height/1.45, // y-coord
            "car", // texture
            0, // frame
            10,
        ).setScale(0.5, 0.5).setOrigin(0, 0);

        // m is multiplier on how far zombie 2 is from zombie 1. Useful if we are moving roads
        var m = 93;
        // min/max value on zombie spawns
        var min = -50;
        var max = -1000;
        // add zombie 1
        this.zombie1 = new Zombie
        (this, game.config.width/2 - 259, -50, 'zombie', Phaser.Math.Between(min, max), 20).setOrigin(0, 0);

        // add zombie 2
        this.zombie2 = new Zombie
        (this, this.zombie1.x + m, Phaser.Math.Between(min, max), 'zombie', 0, 20).setOrigin(0, 0);

        // add zombie 3
        this.zombie3 = new Zombie
        (this, this.zombie1.x + m*2, Phaser.Math.Between(min, max), 'zombie', 0, 20).setOrigin(0, 0);

        this.zombie4 = new Zombie
        (this, game.config.width/2 + 41, Phaser.Math.Between(min, max), 'zombie', 0, 20).setOrigin(0, 0);

        this.zombie5 = new Zombie
        (this, this.zombie4.x + m, Phaser.Math.Between(min, max), 'zombie', 0, 20).setOrigin(0, 0);

        this.zombie6 = new Zombie
        (this, this.zombie4.x + m*2, Phaser.Math.Between(min, max), 'zombie', 0, 20).setOrigin(0, 0);

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
            backgroundColor: "#03938c",
            color: "#FFFFFF",
            align: "left",
            padding: {top: 5, bottom: 5},
            fixedWidth: 150
        };
        this.scoreLeft = this.add.text
        (
            game.config.width/2 + 15, // x-coord
            game.config.height - 27, // y-coord
            "$" + this.p1Score, // initial text
            scoreConfig // config settings
        );

        this.p1Lives = game.settings.playerSpeed;

        // this timer will indicate how much longer until player reaches checkpoint
        this.gameClock = game.settings.gameTimer;
        this.ampm = game.settings.apm;
        
        // create an object to populate the text configuration members
        let gameClockConfig =
        {
            fontFamily: "Courier",
            fontSize: "20px",
            backgroundColor: "#03938c",
            color: "#FFFFFF",
            align: "right",
            padding: {top: 5, bottom: 5},
            fixedWidth: 70
        };
        // add the text to the screen
        this.timeLeft = this.add.text
        (
            game.config.width/2 + 125,       // x-coord
            game.config.height - 80,         // y-coord
            this.formatTime(this.gameClock), // text to display
            gameClockConfig // text style config object
        );
        //  add the event to increment the clock
        //  code adapted from:
        //  https://phaser.discourse.group/t/countdown-timer/2471/3
        this.timedEvent = this.time.addEvent
        (
            {
                delay: 7500, //default 7500 (7.5 seconds)
                callback: () =>
                {
                    this.gameClock += 15000; 
                    this.timeLeft.text = this.formatTime(this.gameClock);
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
        console.count(this.gas);
        // when game is over remove the game clock event
        if(this.gameOver) {
            this.time.removeAllEvents();
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER').setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or M to Menu').setOrigin(0.5);
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
            if(this.gameClock >= 1500000){
                if(this.ampm == 'pm'){
                    this.ampm = 'am'
                }
                if(this.ampm == 'am'){
                    this.ampm = 'pm'
                }
                this.gameClock = 60000;
                this.timeLeft.text = this.formatTime(this.gameClock);
            }
            if (this.gameClock == 360000) {
                this.gameOver = true;
            }
        }
        // rpm indicator
        if(this.gasTimer == "0"){
            this.rpm.destroy();
            this.rpm = this.add.image(game.config.width/2, game.config.height - 54, 'rpm0');
        } else if(this.gasTimer == "1"){
            this.rpm.destroy();
            this.rpm = this.add.image(game.config.width/2, game.config.height - 54, 'rpm1');
        }else if(this.gasTimer == "2"){
            this.rpm.destroy();
            this.rpm = this.add.image(game.config.width/2, game.config.height - 54, 'rpm2');
        }else if(this.gasTimer == "3"){
            this.rpm.destroy();
            this.rpm = this.add.image(game.config.width/2, game.config.height - 54, 'rpm3');
        }else if(this.gasTimer == "4"){
            this.rpm.destroy();
            this.rpm = this.add.image(game.config.width/2, game.config.height - 54, 'rpm4');
        }else if(this.gasTimer == "5"){
            this.rpm.destroy();
            this.rpm = this.add.image(game.config.width/2, game.config.height - 54, 'rpm5');
        }
        // if a player avoids zombies for 15 seconds, they consume gas
        if(this.gasTimer == 6){
            this.consumeGas(this.player);
        }

        // mph indicator
        if(this.p1Lives == "0"){
            this.mph.destroy();
            this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph0');
        } else if(this.p1Lives == "1"){
            this.mph.destroy();
            this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph1');
        } else if(this.p1Lives == "2"){
            this.mph.destroy();
            this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph2');
        } else if(this.p1Lives == "3"){
            this.mph.destroy();
            this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph3');
        } else if(this.p1Lives == "4"){
            this.mph.destroy();
            this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph4');
        } else if(this.p1Lives == "5"){
            this.mph.destroy();
            this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph5');
        } else if(this.p1Lives == "6"){
            this.mph.destroy();
            this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph6');
        } else if(this.p1Lives == "7"){
            this.mph.destroy();
            this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph7');
        } else if(this.p1Lives == "8"){
            this.mph.destroy();
            this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph8');
        } else if(this.p1Lives == "9"){
            this.mph.destroy();
            this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph9');
        } else if(this.p1Lives >= "10"){
            this.mph.destroy();
            this.mph = this.add.image(game.config.width/2, game.config.height - 54, 'mph10');
        }

        // gas indicator
        if(this.gas <= 0){
            this.gasDial.destroy();
            this.gasDial = this.add.image(game.config.width/2, game.config.height - 54, 'gas1');
        } else if(this.gas <= 2){
            this.gasDial.destroy();
            this.gasDial = this.add.image(game.config.width/2, game.config.height - 54, 'gas2');
        } else if(this.gas <= 4){
            this.gasDial.destroy();
            this.gasDial = this.add.image(game.config.width/2, game.config.height - 54, 'gas3');
        } else if(this.gas <= 6){
            this.gasDial.destroy();
            this.gasDial = this.add.image(game.config.width/2, game.config.height - 54, 'gas4');
        } else if(this.gas >= 8){
            this.gasDial.destroy();
            this.gasDial = this.add.image(game.config.width/2, game.config.height - 54, 'gas5');
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
            player.x - 50 + player.width > zombie.x && // right side hitbox
            player.y + 19 < zombie.y + zombie.height && // upper hitbox
            player.height + player.y > zombie.y + 160 // lower hitbox
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
        
        this.scoreLeft.text = "$" + this.p1Score;

        this.p1Lives -= 1;

        if (this.p1Lives <= 0) {
            this.gameOver = true;
        }
    }

    consumeGas(player){
        this.gasTimer = 0;
        this.p1Score -= 10;
        if(this.p1Score < 0){
            this.p1Score += 10;
            this.gas -= 0.5;
            this.gasMeter = this.gas;
        } else {
            this.scoreLeft.text = "$" + this.p1Score;
        }
        this.p1Lives += 1;
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
