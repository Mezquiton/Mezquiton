const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configuración del canvas
canvas.width = 320;
canvas.height = 480;

// Cargar imagen de fondo
const background = new Image();
background.src = 'fondo.png';

// Cargar imagen del pájaro (Gabriel)
const birdImage = new Image();
birdImage.src = 'gabriel.png';

// Variables del juego
let bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.3,
    lift: -6,
    velocity: 0
};

let pipes = [];
let frameCount = 0;
const pipeWidth = 50;
const pipeGap = 100;
let score = 0;

// Control del pájaro para dispositivos de escritorio
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        bird.velocity = bird.lift;
    }
});

document.addEventListener('mousedown', () => {
    bird.velocity = bird.lift;
});

canvas.addEventListener('touchstart', () => {
    bird.velocity = bird.lift;
});

// Función para dibujar el fondo
function drawBackground() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

// Función para dibujar el pájaro (Gabriel)
function drawBird() {
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

// Función para actualizar la posición del pájaro
function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        resetGame();
    }
}

// Función para dibujar los tubos
function drawPipes() {
    ctx.fillStyle = '#0F0';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
}

// Función para actualizar los tubos
function updatePipes() {
    frameCount++;

    if (frameCount % 90 === 0) {
        const pipeHeight = Math.random() * (canvas.height - pipeGap - 40) + 20;
        pipes.push({
            x: canvas.width,
            top: pipeHeight,
            bottom: canvas.height - pipeHeight - pipeGap,
            passed: false
        });
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;

        if (pipe.x + pipeWidth < 0) {
            pipes.shift();
        }

        // Colisión con los tubos
        if (
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
        ) {
            resetGame();
        }

        // Verificar si el pájaro pasó por el tubo
        if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
            pipe.passed = true;
            score++;
        }
    });
}

// Función para dibujar el puntaje
function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.fillText(`Puntaje: ${score}`, 10, 20);
}

// Función para reiniciar el juego
function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    frameCount = 0;
    score = 0;
}

// Función principal del juego
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawBird();
    updateBird();

    drawPipes();
    updatePipes();

    drawScore();

    requestAnimationFrame(gameLoop);
}

// Iniciar el juego
background.onload = function() {
    gameLoop();
};

// Cargar música de fondo
const bgMusic = new Audio('8-bit-arcade.mp3');
bgMusic.loop = true; // Reproducir en bucle

// Verificar y establecer el estado de reproducción de la música al cargar la página
window.onload = function() {
    const musicState = localStorage.getItem('musicState');
    if (musicState === 'play') {
        bgMusic.play(); // Reproducir música de fondo si estaba reproduciéndose
    }
};

// Función para iniciar el juego
function startGame() {
    bgMusic.play(); // Reproducir música de fondo
    localStorage.setItem('musicState', 'play'); // Guardar estado de reproducción de la música
    gameLoop(); // Iniciar bucle del juego
}

// Función para pausar la música y guardar el estado al salir del juego
function stopGame() {
    bgMusic.pause(); // Pausar música de fondo
    localStorage.setItem('musicState', 'pause'); // Guardar estado de reproducción de la música
}

// Iniciar el juego después de cargar la imagen de fondo
background.onload = function() {
    startGame();
};

// Detener la música y guardar el estado al cerrar la página
window.onbeforeunload = function() {
    stopGame();
};
