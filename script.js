// ---- Global Variables & Setup ----
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
let score = 0;

// Gun container
const gunContainer = document.getElementById("gun"); // Gun container element
const gunImage = document.getElementById("gun-image"); // Gun image element

// Bullet image
const bulletImage = new Image();
bulletImage.src = "bullet.png"; // Load the bullet image

// Enemy image
const enemyImage = new Image();
enemyImage.src = "enemy.png"; // Load the enemy image

// Game objects
let enemy = {
  x: 100,
  y: 100,
  width: 70,
  height: 70,
  speedX: 6, // horizontal speed
  speedY: 4, // vertical speed
};

let bullets = []; // Array to hold the bullets
let gunAngle = 0; // Variable to store the angle of the gun
let lastClickX = 0; // Last mouse X position
let lastClickY = 0; // Last mouse Y position

let lastTime = 0; // Time for animation

// Load collision sound
const collisionSound = new Audio("collision-sound.mp3"); // Path to your sound file

// Add a cooldown time (in milliseconds)
// const cooldownTime = 100; // 100ms delay between shots
// let lastFireTime = 0;

canvas.addEventListener("click", (event) => {
  // const currentTime = Date.now();
  // if (currentTime - lastFireTime >= cooldownTime) {
    fireBullet(event);
    rotateGun(event);
    // lastFireTime = currentTime;  // Update the last fire time
  // }
});


// Check for landscape orientation
function checkOrientation()
{
  if (window.innerHeight > window.innerWidth)
  {
    document.getElementById("gameContainer").style.display = "none";
    alert("گوشیو افقی بگیر پیلیز :>");
  } else
  {
    document.getElementById("gameContainer").style.display = "inline-block";
  }
}

// Listen for orientation changes
window.addEventListener("orientationchange", checkOrientation);

// Initial check when the page loads
checkOrientation();

// ---- Functions ----

function fireBullet(event)
{
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const startX = canvas.width / 2;
  const startY = canvas.height - 50; // Starting point of the bullet (bottom-center)

  const angle = Math.atan2(mouseY - startY, mouseX - startX); // Calculate angle

  const speed = 10;  // Bullet speed

  // Velocity in X and Y directions
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;

  bullets.push({
    x: startX,
    y: startY,
    width: 20,
    height: 20,
    vx: vx,
    vy: vy,
  });
}

function rotateGun(event)
{
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const gunX = canvas.width / 2;
  const gunY = canvas.height - 50;

  // Calculate the angle between the gun and the clicked position
  const angle = Math.atan2(mouseY - gunY, mouseX - gunX);

  // Set the rotation for the gun container
  gunContainer.style.transform = `rotate(${angle + 45}rad)`;
}

// Collision detection function
function isColliding(a, b)
{
  if (a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y)
  {
    if (!collisionSound.paused)
    {
      collisionSound.currentTime = 0; // Reset sound to start
    }
    collisionSound.play(); // Play sound on collision
    return true;
  }
  return false;
}

// ---- Game Loop ----
function update(deltaTime)
{
  // // Random chance to change direction (you can adjust the probability)
  // const randomChance = Math.random();
  // if (randomChance < 0.02) // 2% chance per frame to change direction (can be adjusted)
  // {
  //   enemy.speedX = Math.random() < 0.5 ? 6 : -6;  // Randomly change horizontal direction
  //   enemy.speedY = Math.random() < 0.5 ? 4 : -4;  // Randomly change vertical direction
  // }

  // Move the enemy
  enemy.x += enemy.speedX;
  enemy.y += enemy.speedY;

  // Bounce the enemy off the canvas edges
  if (enemy.x < 0 || enemy.x + enemy.width > canvas.width)
  {
    enemy.speedX *= -1;
  }
  if (enemy.y < 0 || enemy.y + enemy.height > canvas.height)
  {
    enemy.speedY *= -1;
  }

  // Move the bullets
  bullets.forEach((bullet, index) =>
  {
    bullet.x += bullet.vx;
    bullet.y += bullet.vy;

    if (isColliding(bullet, enemy))
    {
      score++;
      scoreEl.textContent = score;
      bullets.splice(index, 1);  // Remove the bullet after it hits the enemy
    }
  });

  // Remove bullets that go off-screen
  bullets = bullets.filter((bullet) => bullet.x + bullet.width > 0 &&
    bullet.x < canvas.width &&
    bullet.y + bullet.height > 0 &&
    bullet.y < canvas.height);
}


// Draw everything on the canvas
function draw()
{
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the enemy image
  ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);

  // Draw bullets as images
  bullets.forEach((bullet) =>
  {
    ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

// Main game loop with requestAnimationFrame
function gameLoop(timestamp)
{
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  update(deltaTime);
  draw();

  requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);
