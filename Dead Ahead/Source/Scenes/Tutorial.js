class Tutorial extends Phaser.Scene
{
    constructor()
    {
        super("tutorialScene");
    }

    //--------------------------------------------------------------------------
    // PRELOAD
    //--------------------------------------------------------------------------
    preload()
    {
        // load audio files
        this.load.audio("sfx_select", "./Assets/blip_select12.wav");
        this.load.audio("sfx_explosion", "./Assets/explosion38.wav");
//        this.menu = this.sound.add("bgm");

    }
    //-end preload()------------------------------------------------------------
    //--------------------------------------------------------------------------
    // CREATE
    //--------------------------------------------------------------------------
    create()
    {

        // menu display configuration
        let tutConfig =
        {
            fontFamily: "Courier",
            fontSize: "28px",
            backgroundColor: "#f3b141",
            color: "#843605",
            align: "right",
            padding: {top: 5, bottom: 5},
            fixedWidth: 0
        };

        // meny text positioning
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;

        // show menu text
        this.add.text
        (
            centerX, // x-coord
            centerY - textSpacer, // y-coord
            "TUTORIAL", // initial text to be displayed
            tutConfig // configuration object
        ).setOrigin(0.5);

        // meny music plays
    //    this.sound.play("bgm");

        this.add.text
        (
            centerX,
            centerY,
            "Move with A and D or Arrows",
            tutConfig
        ).setOrigin(0.5);
        tutConfig.backgroundColor = "#00C080"; // set object property
        tutConfig.color = "#000000";
        this.add.text
        (
            centerX,
            centerY + textSpacer,
            "Press Space to start",
            tutConfig
        ).setOrigin(0.5);
        
        // define input keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
    }
    //-end create()-------------------------------------------------------------
    //--------------------------------------------------------------------------
    // UPDATE
    //--------------------------------------------------------------------------
    update()
    {
        if(Phaser.Input.Keyboard.JustDown(keySPACE))
        {
            // configuration settings for easy mode
            game.settings =
            {
                playerSpeed: 4,
                fastzombieSpeed: 4,
                gameTimer: 1320000,                
                gasTimer: 0,
                gas: 8,
                apm: 'pm',
            }
            this.sound.play("sfx_select");
            //this.sound.stop("bgm");
            this.scene.start("playScene");
        }
    }
}
//-end update()-----------------------------------------------------------------
