// Some quick definitions to use later on and tweak as we see fit
var PLAYER_SPAWN_X = 200;
var PLAYER_SPAWN_Y = 375;
var PLAYER_LIVES = 3;
var ENEMY_SPAWN_Y = [56,130,210];


// overly simple restart system for testing later on - not set up yet.
var initializeGame = function() {
  location.reload();
};

// Enemies our player must avoid
var Enemy = function(x, y, velocity) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Setting X and Y locations on our map
    this.x = x;
    this.y = y;
    this.w = 101;
    this.h = 171;

    // Setting enemy velocity
    this.velocity = velocity;
};



// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Iterate enemy x loc by velocity * dt
    this.x += this.velocity * dt;
    // Check collisions over each tick to check for win/loss
    this.checkCollisions();
    // Make sure we loop the enemy back around the canvas
    // Given a bit of wiggle room to make it look smoother
    if (this.x >= 550) {
      this.x = -150;
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Checks our collision based on transparency offsets
Enemy.prototype.checkCollisions = function() {
  if (player.x < this.x + 50 &&
      player.x + 50 > this.x &&
      player.y < this.y + 75 &&
      player.y + 75 > this.y) {
        loseLife();
        player.reset();
        updateHTMLgameInfo();
        console.log("Player Reset. Contact at Player.x = " + this.x + " Player.y = " + this.y);
  }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, velocity){
  // Set image sprite for our player
  this.sprite = 'images/char-boy.png';
  // Set player X and Y starting locations
  this.x = x;
  this.y = y;
  this.w = 101;
  this.h = 171;
  // Set player velocity for speedy gonzales mode
  this.velocity = velocity;
};

// on update, check for win condition.
Player.prototype.update = function(){
  checkWin();
};

// draws out the player sprite
Player.prototype.render = function()  {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handles input - checks to see input value then moves on x or y relative.
// Console logs output for debugging.
Player.prototype.handleInput = function(input) {
  switch (input) {
    case 'left' :
      if (this.x > 0){
        this.x -= this.velocity;
      }
      break;
    case 'up' :
      if (this.y > 0){
        this.y -= this.velocity - 20;
      }
      break;
    case 'right' :
      if (this.x < 375){
        this.x += this.velocity;
      }
      break;
    case 'down' :
      if (this.y < 306){
        this.y += this.velocity - 20;
      }
      break;
  }
};

// Allows us to reset player position after a win.
Player.prototype.reset = function() {
  this.x = PLAYER_SPAWN_X;
  this.y = PLAYER_SPAWN_Y;
};



/*
Adds a new enemy to the board when called.
We randomize X to add an enemy randomly to the board,
we pull the Y value from an array to make sure that it's
lined up along the three stone tiles, and we assign a
random variable inside a range to the speed so we get
variance to our enemies.
*/
var spawnEnemiesOnNewLevel = function(){
  var x = Math.round(Math.random() * (550 - 1 + 1)) + 1;
  var y = ENEMY_SPAWN_Y[Math.floor(Math.random() * ENEMY_SPAWN_Y.length)];

  var velocity = Math.round(Math.random() * (150 - 20 + 1)) + 20;
  enemy = new Enemy(x, y, velocity);
  console.log("New enemy has been generated at X = " + x + ", Y = " + y + " Velocity = " + velocity);
  allEnemies.push(enemy);
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var level = 1;
var score = 0;
var player = new Player(PLAYER_SPAWN_X, PLAYER_SPAWN_Y, 101);
spawnEnemiesOnNewLevel();
allEnemies.push(enemy);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

// call to update game info with proper score and level
var updateHTMLgameInfo = function(){
  document.getElementById("score").innerHTML = score;
  document.getElementById("level").innerHTML = level;
  document.getElementById("health").innerHTML = PLAYER_LIVES;
};

// Check if we hit the completion zone, update appropriate info
var checkWin = function(){
  // Check for win
  if (player.y + 100 <= 100) {
      score += 100;
      level += 1;

      updateHTMLgameInfo();
      spawnEnemiesOnNewLevel();
      player.reset();
  }
};

var loseLife = function(){
  if (PLAYER_LIVES > 0){
      PLAYER_LIVES = PLAYER_LIVES - 1;
  }
  if (PLAYER_LIVES === 0){
    if(alert("You died! You got to level " + level + " and got " + score + " points.")){
    } else {
            window.location.reload();
    }
  }
};
