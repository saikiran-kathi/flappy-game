const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// FULL SCREEN
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// LOAD IMAGES
const birdImg = new Image();
birdImg.src = "bird.png";

const pipeImg = new Image();
pipeImg.src = "pipe.png";

const gameOverImg = new Image();
gameOverImg.src = "gameover.png";

// VARIABLES
let bird;
let pipes;
let frame;
let score;
let gameOver;

let speed = 3;
let pipeWidth = 140;

// INIT GAME
function initGame() {
    bird = {
        x: 200,
        y: canvas.height / 2,
        width: 50,
        height: 50,
        gravity: 0.5,
        lift: -8,
        velocity: 0
    };

    pipes = [];
    frame = 0;
    score = 0;
    gameOver = false;
}

initGame();

// JUMP
function jump() {
    if (!gameOver) bird.velocity = bird.lift;
}

// CONTROLS
document.addEventListener("keydown", function (e) {
    if (e.code === "Space") jump();
    if (e.code === "Enter" && gameOver) initGame();
});

document.addEventListener("mousedown", function () {
    jump();
});

// CREATE PIPE
function createPipe() {
    let gap = 220;
    let topHeight = Math.random() * (canvas.height / 2) + 50;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: canvas.height - topHeight - gap,
        passed: false
    });
}

// DRAW BIRD
function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

// DRAW PIPES
function drawPipes() {
    pipes.forEach(pipe => {

        ctx.drawImage(pipeImg, pipe.x, 0, pipeWidth, pipe.top);
        ctx.drawImage(
            pipeImg,
            pipe.x,
            canvas.height - pipe.bottom,
            pipeWidth,
            pipe.bottom
        );

        pipe.x -= speed;

        // COLLISION
        if (
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top ||
             bird.y + bird.height > canvas.height - pipe.bottom)
        ) {
            gameOver = true;
        }

        // SCORING
        if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
            score++;
            pipe.passed = true;
        }
    });
}

// MAIN LOOP
function update() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {

        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (bird.y > canvas.height || bird.y < 0) {
            gameOver = true;
        }

        if (frame % 120 === 0) createPipe();

        drawPipes();
        drawBird();

        frame++;

        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("Score: " + score, 50, 60);

    } else {

        // DARK OVERLAY
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // IMAGE POSITION
        let imgWidth = canvas.width * 0.4;
        let imgHeight = canvas.height * 0.6;

        let imgX = canvas.width / 2 - imgWidth / 2 - 200; // move slightly left
        let imgY = canvas.height / 2 - imgHeight / 2;

        ctx.drawImage(gameOverImg, imgX, imgY, imgWidth, imgHeight);

        // TEXT POSITION (RIGHT SIDE OF IMAGE)
        let textX = imgX + imgWidth + 80;
        let textY = imgY + 100;

        ctx.fillStyle = "red";   // ALL TEXT RED
        ctx.font = "60px Arial";
        ctx.fillText("GAME OVER", textX, textY);

        ctx.font = "40px Arial";
        ctx.fillText("Score: " + score, textX, textY + 80);

        ctx.font = "40px Arial";
        ctx.fillText("Press ENTER to Restart", textX, textY + 150);
    }

    requestAnimationFrame(update);
}

update();