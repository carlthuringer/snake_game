$(function(){
  var canvas = $("#canvas")[0]; // Find the canvas in the document using jQuery $ and extract its HTML element with [0]
  var pencil = canvas.getContext("2d"); // Get a tool with the '2d' context, we'll call it 'pencil'
  // It's a good metaphor to use for this simple game, because all we will do is tell the pencil to change, or tell it to draw.
  // However it's really a 'Context' object and you can tell it to rotate the canvas like a sheet of paper,
  // slide it around, and even zoom it in and out.
  // But that's more than we will do with this simple game.
  var width = $("#canvas").width();
  var height = $("#canvas").height();

  var boxSize = 10; // We're setting the size of the boxes that make the graphics for the game to 10 pixels wide.
  var currentDirection;
  var food;
  var score;

  var snakeArray; //an array of cells to make up the snake

  setupGame();

  function setupGame() {
    currentDirection = "right"; //default direction
    createSnake();
    food = createFood(); // Create a new food particle and save it in the 'food' variable
    score = 0; //Set the initial score

    // This checks whether the gameLoop timer has been setup, and if it has, it removes the timer.
    if(typeof gameLoop != "undefined") clearInterval(gameLoop);
    // This is a timer that will run the function 'paint' every 60 seconds.
    gameLoop = setInterval(paint, 60);
  };

  function createSnake() {
    var length = 5; //Length of the snake
    snakeArray = []; //Empty array to start with
    for(var i = length - 1; i >= 0; i--) {
      //This will create a horizontal snake starting from the top left
      snakeArray.push({x: i, y:0});
    };
  };

  function createFood() {
    return {
      x: Math.round(Math.random() * (width - boxSize) / boxSize),
      y: Math.round(Math.random() * (height - boxSize) / boxSize),
    };
    //This will create a cell with x/y between 0-44
    //Because there are 45(450/10) positions accross the rows and columns
  };

  function paint() {
    //To avoid the snake trail we need to paint the BG on every frame
    //Lets paint the canvas now
    pencil.fillStyle = "white";
    pencil.fillRect(0, 0, width, height);
    pencil.strokeStyle = "black";
    pencil.strokeRect(0, 0, width, height);

    //The movement code for the snake to come here.
    //The logic is simple
    //Pop out the tail cell and place it infront of the head cell
    var headX = snakeArray[0].x;
    var headY = snakeArray[0].y;
    //These were the position of the head cell.
    //We will increment it to get the new head position
    //Lets add proper direction based movement now
    if(currentDirection == "right") {
      headX++;
    } else if(currentDirection == "left") {
      headX--;
    } else if(currentDirection == "up") {
      headY--;
    } else if(currentDirection == "down") {
      headY++;
    ;}

    //Lets add the game over clauses now
    //This will restart the game if the snake hits the wall
    //Lets add the code for body collision
    //Now if the head of the snake bumps into its body, the game will restart
    if(headX == -1 || headX == width / boxSize || headY == -1 || headY == height / boxSize || checkCollision(headX, headY, snakeArray)) {
      //restart game
      setupGame();
      // And leave the main game loop.
      return;
    };

    //Lets write the code to make the snake eat the food
    //The logic is simple
    //If the new head position matches with that of the food,
    //Create a new head instead of moving the tail
    if(headX == food.x && headY == food.y) {
      var tail = {x: headX, y: headY};
      score++;
      //Create new food
      food = createFood();
    }
    else {
      var tail = snakeArray.pop(); //pops out the last cell
      tail.x = headX; tail.y = headY;
    };
    //The snake can now eat the food.

    snakeArray.unshift(tail); //puts back the tail as the first cell

    for(var i = 0; i < snakeArray.length; i++) {
      var cell = snakeArray[i];
      //Lets paint 10px wide cells
      paint_cell(cell.x, cell.y);
    };

    //Lets paint the food
    paint_cell(food.x, food.y);
    //Lets paint the score
    var score_text = "Score: " + score;
    pencil.fillText(score_text, 5, height - 5)
  };

  //Lets first create a generic function to paint cells
  function paint_cell(x, y) {
    pencil.fillStyle = "green";
    pencil.fillRect(x * boxSize, y * boxSize, boxSize, boxSize);
    pencil.strokeStyle = "white";
    pencil.strokeRect(x * boxSize, y * boxSize, boxSize, boxSize);
  };

  function checkCollision(x, y, array) {
    //This function will check if the provided x/y coordinates exist
    //in an array of cells or not
    for(var i = 0; i < array.length; i++)
    {
      if(array[i].x == x && array[i].y == y)
        return true;
    }
    return false;
  };

  //Lets add the keyboard controls now
  // This first line binds a function to the document's "keydown" event.
  $(document).on('keydown', (function(event){
    // The event has a property called 'which' that tells us what key was pressed.
    var key = event.which;

    // The keys have number codes that we decode into the directions.
    if(key == "37" && currentDirection != "right") {
      currentDirection = "left";
    } else if(key == "38" && currentDirection != "down") {
      currentDirection = "up";
    } else if(key == "39" && currentDirection != "left") {
      currentDirection = "right";
    } else if(key == "40" && currentDirection != "up") {
      currentDirection = "down";
    };
  }));
});
