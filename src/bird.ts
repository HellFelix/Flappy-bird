const canvas = <HTMLCanvasElement> document.getElementById("canvas")!;
const ctx = canvas.getContext('2d')!;

const birdImg = new Image();
birdImg.src = "flappyBird.png";
const backgroundImg = new Image();
backgroundImg.src = "background.png";

birdImg.onload = () => {
    renderImages();
}

let imgCount = 1;

function renderImages() {
    if(--imgCount>0){return}

    animate();
}

class Bird {
    x: number
    y: number
    dx: number
    dy: number
    gravity: number
    isDead: boolean

    constructor(x: number, y: number, dx: number, dy: number) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.gravity = 0.3;
        this.isDead = false;
    }

    move() {
        if (this.y < 540) {
            this.dy += this.gravity;
            this.y += this.dy;
        } else {
            this.dy = 0;
            this.y = 540;
        }
    }

    jump() {
        this.dy = -5;
    }

    draw() {

        ctx.save();
        ctx.drawImage(birdImg, this.x, this.y, 100, 60);

    }
}

// create the bird instance that we will use
const bird = new Bird(150, 250, 0, 0)

class Obsticle {
    opening: number
    height: number
    width: number
    x: number
    speed: number

    constructor( x: number, opening: number, height: number) {
        this.opening = opening;
        this.height = height;
        this.width = 100;
        this.x = x
        this.speed = 5
    }

    move() {
        this.x -= this.speed;
    }

    draw() {
        if (this.x > 0) {
            ctx.fillStyle = "green";
            ctx.fillRect(this.x, 600-this.height, this.width, this.height);
            ctx.fillRect(this.x, 0, this.width, 600-(this.opening + this.height));
        }
    }
}

// this will be the array from which we call the obsticles
const obsticleArray: Obsticle[] = []; 


// when the program is running, we will continually create new obsticles
function createObsticle() {
    if (obsticleArray[obsticleArray.length-1].x < 600) {
        let obsticle = new Obsticle(1000, 150, 100+(Math.random() * 300));
        obsticleArray.push(obsticle);
    }
}

// create first instance of the obsticles
const firstObsticle = new Obsticle(1000, 150, 100+(Math.random() * 400));
obsticleArray.push(firstObsticle);

// allow the bird to jump
window.onkeypress = (event) => {
    if (event.key === ' ' || event.key === 'Spacebar') {
        if (!bird.isDead) {
            bird.jump();
        }
    }
}

const score = document.createElement("h2");
let scoreText = 0;
score.textContent = "Score: " + scoreText;
document.body.appendChild(score);

// takes an obsticle as 
function increaseScore(obsticle: Obsticle) {
    if (bird.x === obsticle.x) {
        scoreText++;
    }
    score.textContent = "Score: " + scoreText;
}


// function to check if the bird is dead
function checkIfDead() {
    if (bird.y < 0 || bird.y > 540) {
        bird.isDead = true;
    }

    // check for collision
    obsticleArray.forEach(obsticle => {
        if (bird.y + 60 > 600 - obsticle.height || bird.y < 600 - (obsticle.height + obsticle.opening)) {
            if (bird.x +100 > obsticle.x && bird.x < obsticle.x + obsticle.width) {
                bird.isDead = true;
            }
        }
    })
}

function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, 0, 0, 1000, 600);

    // check if the bird should die
    checkIfDead();

    // animate the bird
    bird.move();
    bird.draw();


    // create new obsticles
    createObsticle();
    
    // animate the obsticles
    obsticleArray.forEach(obsticle => {
        if (!bird.isDead) {
            obsticle.move();
            increaseScore(obsticle);
        }
        obsticle.draw();
    });
    // delete the obsticle furthest to the left if it is off screen
    if (obsticleArray[0].x < 0) {
        obsticleArray.splice(0, 1);
    }

    ctx.restore();
}