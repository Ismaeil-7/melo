const gameContainer = document.getElementById("game-container");
const basket = document.getElementById("basket");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const gameOverScreen = document.getElementById("game-over");
const finalScoreDisplay = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");
const startSound = document.getElementById("start-sound");
const catchSound = document.getElementById("catch-sound");
const missSound = document.getElementById("miss-sound");
const gameoverSound = document.getElementById("gameover-sound");
const startGameWindow = document.getElementById("start-game");
const startBtn = document.getElementById("start-btn");



let score = 0;
let lives = 3;
let basketSpeed = 20;
let gameInterval;
let objectInterval;
let gameRunning = true;

// Track basket position
let basketX = gameContainer.offsetWidth / 2 - basket.offsetWidth / 2;

// Move basket with arrow keys
document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  if (e.key === "ArrowLeft") {
    basketX -= basketSpeed;
  } else if (e.key === "ArrowRight") {
    basketX += basketSpeed;
  }
  keepBasketInBounds();
  basket.style.left = basketX + "px";
});

// Move basket with mouse
gameContainer.addEventListener("mousemove", (e) => {
  if (!gameRunning) return;
  basketX = e.clientX - basket.offsetWidth / 2;
  keepBasketInBounds();
  basket.style.left = basketX + "px";
});

function keepBasketInBounds() {
  if (basketX < 0) basketX = 0;
  if (basketX > gameContainer.offsetWidth - basket.offsetWidth) {
    basketX = gameContainer.offsetWidth - basket.offsetWidth;
  }
}

// Create falling objects
function createFallingObject() {
  if (!gameRunning) return;
  const obj = document.createElement("div");
  obj.classList.add("falling-object");
  obj.style.left = Math.random() * (gameContainer.offsetWidth - 30) + "px";
  const fruits = ["assets/apple.png", "assets/banana.png", "assets/orange.png"];
  const randomFruit = fruits[Math.floor(Math.random() * fruits.length)];
  obj.style.width = "40px";
  obj.style.height = "40px";
  obj.style.background = `url(${randomFruit}) no-repeat center/contain`;

  
  gameContainer.appendChild(obj);

  let objY = 0;
  let fallSpeed = 3 + score * 0.2; // speed increases with score

  function fall() {
    if (!gameRunning) {
      obj.remove();
      return;
    }

    objY += fallSpeed;
    obj.style.top = objY + "px";

    // Check collision with basket
    if (isColliding(obj, basket)) {
      score++;
      scoreDisplay.textContent = "Score: " + score;
      
      //collision audio
      catchSound.currentTime = 0;
      catchSound.play();

      obj.remove();
      return;
    }

    // If missed
    if (objY > gameContainer.offsetHeight - obj.offsetHeight) {
      lives--;
      livesDisplay.textContent = "Lives: " + lives;
      
      missSound.currentTime = 0;
      missSound.play();
      
      obj.remove();
      if (lives <= 0) {
        endGame();
      }
      return;
    }

    requestAnimationFrame(fall);
  }

  requestAnimationFrame(fall);
}

// Collision detection
function isColliding(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  return !(
    aRect.top > bRect.bottom ||
    aRect.bottom < bRect.top ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

// Start game
function startGame() {
  score = 0;
  lives = 3;
  gameRunning = true;
  scoreDisplay.textContent = "Score: 0";
  livesDisplay.textContent = "Lives: 3";
  gameOverScreen.style.display = "none";

  basketX = gameContainer.offsetWidth / 2 - basket.offsetWidth / 2;
  basket.style.left = basketX + "px";

  //start audio
  startSound.currentTime = 0;
  startSound.play();
  objectInterval = setInterval(createFallingObject, 1500);
}
startBtn.addEventListener("click", () => {
  startGameWindow.style.display = "none"; 
  startGame();
});


// End game
function endGame() {
  gameRunning = false;
  clearInterval(objectInterval);
 
  gameoverSound.currentTime = 0;
  gameoverSound.play();
  
  finalScoreDisplay.textContent = "Your Score: " + score;
  gameOverScreen.style.display = "block";
}

// Restart
restartBtn.addEventListener("click", () => {
  document.querySelectorAll(".falling-object").forEach((obj) => obj.remove());
  startGame();
});

startGame();



