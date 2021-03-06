//Secondly, I set the 'type' property to Phaser.AUTO. Phaser.AUTO automatically uses WebGL. This is the rendering constext that will be used for the game.

//We will set up the config object and we start by setting the canvas below at the height of 600 and the width to 800.

const config = {
    type: Phaser.WebGL,
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var alphabet;
var dragon;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

//Below we will have an instance of a Phaser.Game object which will be assigned to a local variable called 'game' and the configuration object is passed to it.
var game = new Phaser.Game(config);


//Here we will load components. You do this by putting calls to the Phaser loader inside of a scene function called preload! Phaser will automatically find this function when its starts and loads anything that is defined in it.

//The listed keys like 'sky' or 'ground' in the preload function is what will be used in the code when creating game objects.

//What you see below is 5 components. These are 4 images and 1 spritesheet. Spritesheets are used for animation and in this example we have upto 9 different/seperate characteristics which allows the character to look like its moving.

//It is essential that we load these images based on how we want to see the layers. So in this case we have sky to go down first on top of the sky we have the ground, on top of the ground we have the alphabet letters etc

function preload ()
{
    this.load.image('sky', 'components/images/sky.png');
    this.load.image('sky1', 'components/images/space1.png');
    this.load.image('ground', 'components/images/ground_1x1.png');
    this.load.image('grass', 'components/images/ground.png');
    this.load.image('alphabet', 'alphabet/letter_A.png');
    this.load.spritesheet('dragon', 'components/spritesheets/dragon.png', { frameWidth: 96, frameHeight:63 });
    this.load.spritesheet('Ninja', 'components/spritesheets/metalslug_monster39x40.png', { frameWidth: 39, frameHeight: 40 });
    this.load.spritesheet('mummy', 'components/spritesheets/mummy37x45.png', { frameWidth: 37, frameHeight: 45 });
    this.load.spritesheet('boom', 'components/spritesheets/explosion.png', { frameWidth: 64, frameHeight: 64, endFrame: 23 });
}

function create () {

  this.add.text(100, 1800, 'STAGE 1 JUMP ^', { color: '#00ff00' }).setOrigin(0.5, 0);
  this.add.text(100, 1000, 'STAGE 2 CREEP >', { color: '#00ff00' }).setOrigin(0.5, 0);
  // this.add.text(100, 650, 'LAST STAGE ^', { color: '#00ff00' }).setOrigin(0.5, 0);



    //This.add.image allows to add images after preloading the asset and assigning a key. Below is an example of the sky

    // this.add.image(400, 300, 'sky'); // Actual
    this.add.image(400, 300, 'sky');
    // this.add.image(400, 200, 'sky')


    //  for each platform we are adding a physics function with a staticGroup method.
    platforms = this.physics.add.staticGroup();

    //  Here we create the different platforms.

    platforms.create(-150, 235, 'ground');
    platforms.create(750, 410, 'ground');
    platforms.create(300, 585,'ground')
    platforms.create(600, 760, 'ground');
    platforms.create(-150, 935, 'ground');
    platforms.create(750, 1110, 'ground');
    platforms.create(300, 1285,'ground')
    platforms.create(600, 1460, 'ground');
    platforms.create(-150, 1635, 'ground');
    platforms.create(750, 1810, 'ground');

    platforms.create(400, 1985, 'ground').setScale(1).refreshBody();

    //=========================================================

    //This creates a new sprite called 'player' positioned at 100 x 450 pixels from the bottom of the game. This has a Dynamice Physics body by default. This sprite variable 'player' is then given a slight bounce of 0.1. It is then set to 'collide' with the 'worldbounds'.


    // The player (position on the x axis, height) - calling the player 'Ninja'
    // player = this.physics.add.sprite(80, 100, 'Ninja'); //Top floor for testing
    // player = this.physics.add.sprite(80, 1220, 'Ninja'); //Third floor for testing
    player = this.physics.add.sprite(80, 1900, 'Ninja').setScale(1); //Bottom floor for testing
    // game.camera.follow(player);

    //  Player physics properties. Gives the the ninja a slight bounce.
    player.setBounce(0.4);
    player.setCollideWorldBounds(true);
    player.setCollideWorldBounds(true);

    this.cameras.main.setBounds(0, 0, 800, 2000);
    this.physics.world.setBounds(0, 0, 800, 2000);

    this.cameras.main.startFollow(player);

    this.cameras.main.setZoom(1);

    //=======================keyboard(cursor functions)=======

    cursors = this.input.keyboard.createCursorKeys();

    // const Ninja1 = player.setFlipX(true)
    //  This is where the animation of the character takes place walking left, walking right and turning.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('Ninja', { start: 0, end: 20 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'Ninja', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('Ninja', { start: 0, end: 20 }),
        frameRate: 10,
        repeat: -1

    });

      //======================================================


     //  Input Events

     // Here is where the letters are created. Moving from left to right along the x axis we have put in a value of 90px. There are 10 letters in the console however in this code we obviously start from the number 0
    letters = this.physics.add.group({
        key: 'alphabet',
        repeat: 9,
        setXY: { x: 90, y: 0, stepX: 70 }
    });

    letters.children.iterate(function (child) {

        //  Give each letter the same bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.15, 0.15));

    });

    dragon = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFF' });

    //  Collide the player and the letters with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(letters, platforms);
    this.physics.add.collider(dragon, platforms);
    // this.physics.add.collider(enemy, platforms);

    //  Checks to see if the player overlaps with any of the letters, if he does call the collectLetters function

    this.physics.add.overlap(player, letters, collectLetters, null, this);

    this.physics.add.collider(player, dragon, hitDragon, null, this);


           //=====================Mummy Animation==================================

    const mummyAnimation = this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('mummy'),
        frameRate: 16,
        repeat: -1
    });
    // console.log('this', this);
    const sprite = this.add.sprite(30, 549, 'mummy').setScale(1).setFlipX(true); //Positioning on page
    const sprite1 = this.add.sprite(355, 1073, 'mummy').setScale(1).setFlipX(true); //Positioning on page
    // window.mummy = sprite;
    sprite.anims.play('walk', true);
    sprite1.anims.play('walk', true);
    // sprite.anims.play({ key: 'walk', repeat: 300 });
    sprite.yoyoCounter = 0;
    sprite1.yoyoCounter = 0;


    this.tweens.add({
        yoyo: true,
        repeat: -1,
        targets: sprite,
        x: 700, // x axis from 50-700..
        duration: 8000, //duration to reach end of x axis
        ease: 'Linear',
        onActive: function () {

        sprite.toggleFlipX();

      }, //end of onActive key function

        onYoyo: function (args) {
          sprite.yoyoCounter ++;
          if ( sprite.yoyoCounter % 2 === 0 ) {
            sprite.toggleFlipX();
          }
        },


    }); //end of tweens function

    this.tweens.add({
        yoyo: true,
        repeat: -1,
        targets: sprite1,
        x: 790,
        duration: 8000,
        ease: 'Linear',
        onActive: function () {
        sprite1.toggleFlipX();

        },
        onYoyo: function (args) {
          sprite1.yoyoCounter ++;
          if ( sprite1.yoyoCounter % 2 === 0 ) {
            sprite1.toggleFlipX();
          }
        },

     }); //end of tweens function2


} // end of create funciton.




function update () {

    if (gameOver)
    {
        return;
    }

    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }

} // end of update function


function collectLetters (player, alphabet)
{
    alphabet.disableBody(true, true);

    //  Add and update the score
    score += 1;
    scoreText.setText('Score: ' + score);

    if (letters.countActive(true) === 0)
    {
        //  A new batch of letters to collect
        letters.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });


       //========================Dragon====================

        var x1 = (player.x1 < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var enemy = dragon.create(x1, 16, 'dragon');
        enemy.setBounce(1);
        enemy.setCollideWorldBounds(true);
        enemy.setVelocity(Phaser.Math.Between(-200, 200), 20);
        enemy.allowGravity = false;

    }

} //end of function collect letters

function hitDragon (player, dragon) {
    this.physics.pause();

    player.setTint(0xffffff);

    player.anims.play('turn');

    gameOver = true;

} //End of hit dragon function
