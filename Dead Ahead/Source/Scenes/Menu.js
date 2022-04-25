class Menu extends Phaser.Scene
{
    constructor()
    {
        super("menuScene");
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
        let menuConfig =
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
            "DEAD AHEAD", // initial text to be displayed
            menuConfig // configuration object
        ).setOrigin(0.5);

        // meny music plays
    //    this.sound.play("bgm");

        this.add.text
        (
            centerX,
            centerY,
            "Move with arrow keys",
            menuConfig
        ).setOrigin(0.5);
        menuConfig.backgroundColor = "#00C080"; // set object property
        menuConfig.color = "#000000";
        this.add.text
        (
            centerX,
            centerY + textSpacer,
            "Press (E) for Easy or (H) for Hard",
            menuConfig
        ).setOrigin(0.5);
        
        // define input keys
        keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        
    }
    //-end create()-------------------------------------------------------------
    //--------------------------------------------------------------------------
    // UPDATE
    //--------------------------------------------------------------------------
    update()
    {
        if(Phaser.Input.Keyboard.JustDown(keyE))
        {
            // configuration settings for easy mode
            game.settings =
            {
                spaceshipSpeed: 3,
                fastshipSpeed: 4,
                gameTimer: 720000
            }
            this.sound.play("sfx_select");
            //this.sound.stop("bgm");
            this.scene.start("playScene");
        }

        // configuration settings for hard mode
        if(Phaser.Input.Keyboard.JustDown(keyH))
        {
            game.settings =
            {
                spaceshipSpeed: 4,
                fastshipSpeed: 5,
                gameTimer: 45000
            }
            this.sound.play("sfx_select");
            //this.sound.stop("bgm");
            this.scene.start("playScene");
        } 
    }
}
//-end update()-----------------------------------------------------------------

