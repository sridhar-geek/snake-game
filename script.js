/** Defining html elements  */
const board = document.getElementById("gameBoard");
const logo = document.getElementById("snakeImage");
const instruction = document.getElementById("text");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highscore");

highScoreText.style.display = "none"

/**Define game varaibles */
let gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateRandomFood();
let initialDirection = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore = 0;

// get random number for food
function generateRandomFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// create a snake
const createGameElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

// Draw food
const drawFood = () => {
  if(gameStarted) {
  const foodElement = createGameElement("div", "food");
  setPosition(foodElement, food);
  board.appendChild(foodElement);
  }
};

// Set the position of food (cube)
const setPosition = (element, position) => {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
};

// draw snake
const drawSnake = () => {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
};

//Updates Score of the game
const updateScore = () => {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
};

// Stops Game

const stopGame = () => {
  clearInterval(gameInterval);
  gameStarted = false;
  instruction.style.display = "block";
  logo.style.display = "block";
};

// Update highScore function 
const updateHighScore = () => {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, "0");
  }
  highScoreText.style.display = 'block'
};

// Resets Game
const resetGame = () => {
  updateHighScore();
  stopGame();
  snake = [{ x: 9, y: 9 }];
  food = generateRandomFood();
  // direction = "right";
  gameSpeedDelay = 200;
  updateScore();
};

// Check for Collision of Snake
const checkCollision = () => {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
};

// Increase Speed of the snake
const increaseSpeed = () => {
  if (gameSpeedDelay > 150) gameSpeedDelay -= 5;
  else if (gameSpeedDelay > 100) gameSpeedDelay -= 3;
  else if (gameSpeedDelay > 50) gameSpeedDelay -= 2;
  else if (gameSpeedDelay > 100) gameSpeedDelay -= 1;
};
// Main function which draws food, snake
const draw = () => {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
};

// Moving Snake in given direction
const moveSnake = () => {
  const head = { ...snake[0] };
  switch (initialDirection) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "right":
      head.x++;
      break;
    case "left":
      head.x--;
      break;
  }
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateRandomFood();
    increaseSpeed();
    clearInterval(gameInterval); // clears past interval
    gameInterval = setInterval(() => {
      moveSnake();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
};

// Main function which starts the game
const startGame = () => {
  gameStarted = true; // to keep track of a running game
  instruction.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    moveSnake();
    checkCollision();
    draw();
  }, gameSpeedDelay);
};

// keyPress Listner Event starts the game or control the snake
const handleKeyPress = (event) => {
  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.key === " ")
  ) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        initialDirection = "up";
        break;
      case "ArrowDown":
        initialDirection = "down";
        break;
      case "ArrowRight":
        initialDirection = "right";
        break;
      case "ArrowLeft":
        initialDirection = "left";
        break;
    }
  }
};

document.addEventListener("keydown", handleKeyPress);
