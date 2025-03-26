
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
let score = 0;


const gunContainer = document.getElementById("gun");
const gunImage = document.getElementById("gun-image");


const bulletImage = new Image();
bulletImage.src = "bullet.png";


const enemyImage = new Image();
enemyImage.src = "enemy.png";


let enemy = {
  x: 100,
  y: 100,
  width: 70,
  height: 70,
  speedX: 6,
  speedY: 4,
};

let bullets = [];
let gunAngle = 0;
let lastClickX = 0;
let lastClickY = 0;

let lastTime = 0;


const collisionSound = new Audio("collision-sound.mp3");

canvas.addEventListener("click", (event) =>
{
  fireBullet(event);
  rotateGun(event);
});



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


window.addEventListener("orientationchange", checkOrientation);


checkOrientation();



function fireBullet(event)
{
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const startX = canvas.width / 2;
  const startY = canvas.height - 50;

  const angle = Math.atan2(mouseY - startY, mouseX - startX);

  const speed = 10;


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


  const angle = Math.atan2(mouseY - gunY, mouseX - gunX);


  gunContainer.style.transform = `rotate(${angle + 45}rad)`;
}


function isColliding(a, b)
{
  if (a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y)
  {
    if (!collisionSound.paused)
    {
      collisionSound.currentTime = 0;
    }
    collisionSound.play();
    return true;
  }
  return false;
}


function update(deltaTime)
{
  enemy.x += enemy.speedX;
  enemy.y += enemy.speedY;


  if (enemy.x < 0 || enemy.x + enemy.width > canvas.width)
  {
    enemy.speedX *= -1;
  }
  if (enemy.y < 0 || enemy.y + enemy.height > canvas.height)
  {
    enemy.speedY *= -1;
  }


  bullets.forEach((bullet, index) =>
  {
    bullet.x += bullet.vx;
    bullet.y += bullet.vy;

    if (isColliding(bullet, enemy))
    {
      score++;
      scoreEl.textContent = score;
      bullets.splice(index, 1);
    }
  });


  bullets = bullets.filter((bullet) => bullet.x + bullet.width > 0 &&
    bullet.x < canvas.width &&
    bullet.y + bullet.height > 0 &&
    bullet.y < canvas.height);
}



function draw()
{

  ctx.clearRect(0, 0, canvas.width, canvas.height);


  ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);


  bullets.forEach((bullet) =>
  {
    ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
  });
}


function gameLoop(timestamp)
{
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  update(deltaTime);
  draw();

  requestAnimationFrame(gameLoop);
}


requestAnimationFrame(gameLoop);
