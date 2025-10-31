// Konfigurasi game
const config = {
    boardWidth: 31, // Lebar papan game (kolom)
    boardHeight: 21, // Tinggi papan game (baris)
    cellSize: 20, // Ukuran setiap sel dalam pixel
    pacmanSpeed: 150, // Kecepatan Pacman (ms)
    ghostSpeed: 200, // Kecepatan hantu (ms)
    scaredTime: 10000 // Waktu mode takut (ms)
};

// Status game
let gameState = {
    score: 0, // Skor pemain
    lives: 3, // Jumlah nyawa
    dots: 0, // Jumlah titik yang tersisa
    isRunning: false, // Status apakah game sedang berjalan
    isScared: false, // Status apakah hantu dalam mode takut
    scaredTimer: null // Timer untuk mode takut
};

// Posisi dan arah Pacman
let pacman = {
    x: 15, // Posisi X awal Pacman
    y: 15, // Posisi Y awal Pacman
    direction: 'right', // Arah awal Pacman
    nextDirection: 'right' // Arah berikutnya yang diminta
};

// Array untuk hantu
let ghosts = [
    { name: 'blinky', x: 15, y: 7, direction: 'left', color: 'red' }, // Hantu Blinky
    { name: 'pinky', x: 15, y: 9, direction: 'up', color: 'pink' }, // Hantu Pinky
    { name: 'inky', x: 14, y: 9, direction: 'down', color: 'cyan' }, // Hantu Inky
    { name: 'clyde', x: 16, y: 9, direction: 'right', color: 'orange' } // Hantu Clyde
];

// Peta game - 1: dinding, 0: titik biasa, 2: power pellet
const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,1,0,1,0,1,1,1,0,1,0,1,1,0,1,1,1,0,1,1,0,1],
    [1,2,1,1,0,1,1,1,0,1,1,0,1,0,1,1,1,0,1,0,1,1,0,1,1,1,0,1,1,2,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,0,1,1,1,1],
    [0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0],
    [1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,1],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1],
    [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
    [1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,1,1,0,1,0,1,1,0,1,1,0,1,0,1,1,1,1,1,0,1,1,0,1],
    [1,2,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2,1],
    [1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Mendapatkan elemen DOM
const gameBoard = document.getElementById('game-board'); // Elemen papan game
const scoreElement = document.getElementById('score'); // Elemen skor
const livesElement = document.getElementById('lives'); // Elemen nyawa
const startBtn = document.getElementById('start-btn'); // Tombol mulai
const resetBtn = document.getElementById('reset-btn'); // Tombol reset
const restartBtn = document.getElementById('restart-btn'); // Tombol restart
const playAgainBtn = document.getElementById('play-again-btn'); // Tombol main lagi
const gameOverScreen = document.getElementById('game-over'); // Layar game over
const gameWonScreen = document.getElementById('game-won'); // Layar menang
const finalScoreElement = document.getElementById('final-score'); // Elemen skor akhir
const winScoreElement = document.getElementById('win-score'); // Elemen skor menang

// Mendapatkan elemen audio
const eatSound = document.getElementById('eat-sound'); // Suara saat makan titik
const backgroundSound = document.getElementById('background-sound'); // Suara background
const gameoverSound = document.getElementById('gameover-sound'); // Suara game over
const victorySound = document.getElementById('victory-sound'); // Suara kemenangan

// Fungsi untuk membuat papan game
function createBoard() {
    gameBoard.innerHTML = ''; // Kosongkan papan game
    gameState.dots = 0; // Reset jumlah titik
    
    // Loop melalui setiap baris dan kolom peta
    for (let y = 0; y < config.boardHeight; y++) {
        for (let x = 0; x < config.boardWidth; x++) {
            const cell = document.createElement('div'); // Buat elemen div untuk sel
            cell.className = 'cell'; // Tambahkan class cell
            cell.id = `cell-${x}-${y}`; // Set ID unik untuk sel
            
            // Periksa tipe sel berdasarkan peta
            if (map[y][x] === 1) {
                cell.classList.add('wall'); // Tambahkan class wall untuk dinding
            } else if (map[y][x] === 0) {
                const dot = document.createElement('div'); // Buat elemen untuk titik
                dot.className = 'dot'; // Tambahkan class dot
                cell.appendChild(dot); // Tambahkan titik ke sel
                gameState.dots++; // Tambah jumlah titik
            } else if (map[y][x] === 2) {
                const powerPellet = document.createElement('div'); // Buat elemen untuk power pellet
                powerPellet.className = 'power-pellet'; // Tambahkan class power-pellet
                cell.appendChild(powerPellet); // Tambahkan power pellet ke sel
                gameState.dots++; // Tambah jumlah titik
            }
            
            gameBoard.appendChild(cell); // Tambahkan sel ke papan game
        }
    }
}

// Fungsi untuk menggambar Pacman
function drawPacman() {
    // Hapus Pacman dari posisi sebelumnya
    document.querySelectorAll('.pacman').forEach(el => el.remove());
    
    // Gambar Pacman di posisi baru
    const pacmanCell = document.getElementById(`cell-${pacman.x}-${pacman.y}`);
    const pacmanElement = document.createElement('div');
    pacmanElement.className = `pacman ${pacman.direction}`;
    pacmanCell.appendChild(pacmanElement);
}

// Fungsi untuk menggambar hantu
function drawGhosts() {
    // Hapus semua hantu
    document.querySelectorAll('.ghost').forEach(el => el.remove());
    
    // Gambar setiap hantu
    ghosts.forEach(ghost => {
        const ghostCell = document.getElementById(`cell-${ghost.x}-${ghost.y}`);
        const ghostElement = document.createElement('div');
        ghostElement.className = `ghost ${ghost.name} ${gameState.isScared ? 'scared' : ''}`;
        ghostCell.appendChild(ghostElement);
    });
}

// Fungsi untuk memindahkan Pacman
function movePacman() {
    // Coba arah berikutnya terlebih dahulu
    let nextX = pacman.x;
    let nextY = pacman.y;
    
    // Tentukan posisi berikutnya berdasarkan arah yang diminta
    switch (pacman.nextDirection) {
        case 'right': nextX++; break;
        case 'left': nextX--; break;
        case 'up': nextY--; break;
        case 'down': nextY++; break;
    }
    
    // Jika arah berikutnya valid, ubah arah
    if (isValidMove(nextX, nextY)) {
        pacman.direction = pacman.nextDirection;
    }
    
    // Hitung posisi berikutnya berdasarkan arah saat ini
    nextX = pacman.x;
    nextY = pacman.y;
    
    switch (pacman.direction) {
        case 'right': nextX++; break;
        case 'left': nextX--; break;
        case 'up': nextY--; break;
        case 'down': nextY++; break;
    }
    
    // Jika gerakan valid, pindahkan Pacman
    if (isValidMove(nextX, nextY)) {
        pacman.x = nextX;
        pacman.y = nextY;
        
        // Cek apakah ada titik atau power pellet
        checkDotCollision();
        
        // Cek tabrakan dengan hantu
        checkGhostCollision();
    }
    
    drawPacman(); // Gambar Pacman di posisi baru
}

// Fungsi untuk memindahkan hantu
function moveGhosts() {
    ghosts.forEach(ghost => {
        // Tentukan arah acak untuk hantu
        const directions = ['up', 'down', 'left', 'right'];
        const possibleDirections = [];
        
        // Periksa setiap arah yang mungkin
        for (const dir of directions) {
            let nextX = ghost.x;
            let nextY = ghost.y;
            
            switch (dir) {
                case 'right': nextX++; break;
                case 'left': nextX--; break;
                case 'up': nextY--; break;
                case 'down': nextY++; break;
            }
            
            // Jika gerakan valid dan bukan arah berlawanan, tambahkan ke kemungkinan
            if (isValidMove(nextX, nextY) && dir !== getOppositeDirection(ghost.direction)) {
                possibleDirections.push(dir);
            }
        }
        
        // Jika ada arah yang mungkin
        if (possibleDirections.length > 0) {
            // Pilih arah acak dari kemungkinan yang ada
            const randomIndex = Math.floor(Math.random() * possibleDirections.length);
            ghost.direction = possibleDirections[randomIndex];
            
            // Gerakkan hantu
            let nextX = ghost.x;
            let nextY = ghost.y;
            
            switch (ghost.direction) {
                case 'right': nextX++; break;
                case 'left': nextX--; break;
                case 'up': nextY--; break;
                case 'down': nextY++; break;
            }
            
            ghost.x = nextX;
            ghost.y = nextY;
        }
        // Jika tidak ada arah yang mungkin, hantu akan berbalik arah
        else {
            ghost.direction = getOppositeDirection(ghost.direction);
            
            let nextX = ghost.x;
            let nextY = ghost.y;
            
            switch (ghost.direction) {
                case 'right': nextX++; break;
                case 'left': nextX--; break;
                case 'up': nextY--; break;
                case 'down': nextY++; break;
            }
            
            if (isValidMove(nextX, nextY)) {
                ghost.x = nextX;
                ghost.y = nextY;
            }
        }
    });
    
    drawGhosts(); // Gambar hantu di posisi baru
}

// Fungsi untuk mendapatkan arah berlawanan
function getOppositeDirection(direction) {
    switch (direction) {
        case 'right': return 'left';
        case 'left': return 'right';
        case 'up': return 'down';
        case 'down': return 'up';
    }
}

// Fungsi untuk memeriksa apakah gerakan valid
function isValidMove(x, y) {
    // Periksa batas peta
    if (x < 0 || x >= config.boardWidth || y < 0 || y >= config.boardHeight) {
        return false;
    }
    
    // Periksa apakah ada dinding
    return map[y][x] !== 1;
}

// Fungsi untuk memeriksa tabrakan dengan titik
function checkDotCollision() {
    const cell = document.getElementById(`cell-${pacman.x}-${pacman.y}`);
    
    // Cek apakah ada titik
    const dot = cell.querySelector('.dot');
    if (dot) {
        dot.remove(); // Hapus titik
        gameState.score += 10; // Tambah skor
        gameState.dots--; // Kurangi jumlah titik
        updateScore(); // Perbarui tampilan skor
        
        // Mainkan suara makan
        playEatSound();
    }
    
    // Cek apakah ada power pellet
    const powerPellet = cell.querySelector('.power-pellet');
    if (powerPellet) {
        powerPellet.remove(); // Hapus power pellet
        gameState.score += 50; // Tambah skor lebih banyak
        gameState.dots--; // Kurangi jumlah titik
        updateScore(); // Perbarui tampilan skor
        
        // Mainkan suara makan
        playEatSound();
        
        // Aktifkan mode scared
        activateScaredMode();
    }
    
    // Cek apakah semua titik telah dimakan
    if (gameState.dots === 0) {
        winGame(); // Panggil fungsi menang
    }
}

// Fungsi untuk memainkan suara makan
function playEatSound() {
    eatSound.currentTime = 0; // Set ulang waktu pemutaran
    eatSound.play().catch(e => console.log("Error playing eat sound: ", e)); // Mainkan suara
}

// Fungsi untuk mengaktifkan mode scared
function activateScaredMode() {
    gameState.isScared = true; // Set status scared
    drawGhosts(); // Gambar ulang hantu dengan warna scared
    
    // Hapus timer sebelumnya jika ada
    if (gameState.scaredTimer) {
        clearTimeout(gameState.scaredTimer);
    }
    
    // Set timer untuk mode scared
    gameState.scaredTimer = setTimeout(() => {
        gameState.isScared = false; // Nonaktifkan mode scared
        drawGhosts(); // Gambar ulang hantu dengan warna normal
    }, config.scaredTime);
}

// Fungsi untuk memeriksa tabrakan dengan hantu
function checkGhostCollision() {
    for (const ghost of ghosts) {
        if (pacman.x === ghost.x && pacman.y === ghost.y) {
            if (gameState.isScared) {
                // Hantu dimakan
                resetGhost(ghost);
                gameState.score += 200; // Tambah skor besar
                updateScore(); // Perbarui tampilan skor
                
                // Mainkan suara makan
                playEatSound();
            } else {
                // Pacman dimakan
                loseLife(); // Kurangi nyawa
            }
            break;
        }
    }
}

// Fungsi untuk reset posisi hantu
function resetGhost(ghost) {
    ghost.x = 15; // Kembalikan ke posisi awal X
    ghost.y = 9; // Kembalikan ke posisi awal Y
}

// Fungsi untuk kehilangan nyawa
function loseLife() {
    gameState.lives--; // Kurangi nyawa
    updateLives(); // Perbarui tampilan nyawa
    
    if (gameState.lives <= 0) {
        gameOver(); // Jika nyawa habis, game over
    } else {
        // Reset posisi Pacman dan hantu
        resetPositions();
    }
}

// Fungsi untuk reset posisi semua karakter
function resetPositions() {
    // Reset posisi Pacman
    pacman.x = 15;
    pacman.y = 15;
    pacman.direction = 'right';
    pacman.nextDirection = 'right';
    
    // Reset posisi hantu
    ghosts[0] = { name: 'blinky', x: 15, y: 7, direction: 'left', color: 'red' };
    ghosts[1] = { name: 'pinky', x: 15, y: 9, direction: 'up', color: 'pink' };
    ghosts[2] = { name: 'inky', x: 14, y: 9, direction: 'down', color: 'cyan' };
    ghosts[3] = { name: 'clyde', x: 16, y: 9, direction: 'right', color: 'orange' };
    
    drawPacman(); // Gambar Pacman
    drawGhosts(); // Gambar hantu
}

// Fungsi untuk memperbarui tampilan skor
function updateScore() {
    scoreElement.textContent = gameState.score; // Perbarui teks skor
}

// Fungsi untuk memperbarui tampilan nyawa
function updateLives() {
    livesElement.textContent = gameState.lives; // Perbarui teks nyawa
}

// Fungsi untuk game over
function gameOver() {
    gameState.isRunning = false; // Hentikan game
    finalScoreElement.textContent = gameState.score; // Tampilkan skor akhir
    gameOverScreen.style.display = 'block'; // Tampilkan layar game over
    
    // Hentikan suara background
    backgroundSound.pause();
    backgroundSound.currentTime = 0;
    
    // Mainkan suara game over
    gameoverSound.play().catch(e => console.log("Error playing gameover sound: ", e));
}

// Fungsi untuk menang
function winGame() {
    gameState.isRunning = false; // Hentikan game
    winScoreElement.textContent = gameState.score; // Tampilkan skor menang
    gameWonScreen.style.display = 'block'; // Tampilkan layar menang
    
    // Hentikan suara background
    backgroundSound.pause();
    backgroundSound.currentTime = 0;
    
    // Mainkan suara kemenangan
    victorySound.play().catch(e => console.log("Error playing victory sound: ", e));
}

// Fungsi untuk reset game
function resetGame() {
    // Reset status game
    gameState.score = 0;
    gameState.lives = 3;
    gameState.isRunning = false;
    gameState.isScared = false;
    
    // Hapus timer scared jika ada
    if (gameState.scaredTimer) {
        clearTimeout(gameState.scaredTimer);
    }
    
    // Hentikan semua suara
    eatSound.pause();
    eatSound.currentTime = 0;
    backgroundSound.pause();
    backgroundSound.currentTime = 0;
    gameoverSound.pause();
    gameoverSound.currentTime = 0;
    victorySound.pause();
    victorySound.currentTime = 0;
    
    updateScore(); // Perbarui tampilan skor
    updateLives(); // Perbarui tampilan nyawa
    
    resetPositions(); // Reset posisi karakter
    createBoard(); // Buat ulang papan game
    
    // Sembunyikan layar game over dan menang
    gameOverScreen.style.display = 'none';
    gameWonScreen.style.display = 'none';
}

// Event listener untuk tombol mulai
startBtn.addEventListener('click', () => {
    if (!gameState.isRunning) {
        gameState.isRunning = true; // Set status game berjalan
        
        // Mainkan suara background
        backgroundSound.play().catch(e => console.log("Error playing background sound: ", e));
        
        gameLoop(); // Mulai game loop
    }
});

// Event listener untuk tombol reset
resetBtn.addEventListener('click', resetGame);

// Event listener untuk tombol restart
restartBtn.addEventListener('click', resetGame);

// Event listener untuk tombol main lagi
playAgainBtn.addEventListener('click', resetGame);

// Event listener untuk keyboard
document.addEventListener('keydown', (e) => {
    if (!gameState.isRunning) return; // Abaikan jika game tidak berjalan
    
    // Set arah berikutnya berdasarkan tombol panah
    switch (e.key) {
        case 'ArrowUp':
            pacman.nextDirection = 'up';
            break;
        case 'ArrowDown':
            pacman.nextDirection = 'down';
            break;
        case 'ArrowLeft':
            pacman.nextDirection = 'left';
            break;
        case 'ArrowRight':
            pacman.nextDirection = 'right';
            break;
    }
});

// Variabel untuk melacak waktu gerakan terakhir
let lastPacmanMove = 0;
let lastGhostMove = 0;

// Fungsi game loop utama
function gameLoop(timestamp) {
    if (!gameState.isRunning) return; // Hentikan jika game tidak berjalan
    
    requestAnimationFrame(gameLoop); // Request frame berikutnya
    
    // Gerakkan Pacman jika sudah waktunya
    if (timestamp - lastPacmanMove > config.pacmanSpeed) {
        movePacman();
        lastPacmanMove = timestamp;
    }
    
    // Gerakkan hantu jika sudah waktunya
    if (timestamp - lastGhostMove > config.ghostSpeed) {
        moveGhosts();
        lastGhostMove = timestamp;
    }
}

// Fungsi inisialisasi game
function init() {
    createBoard(); // Buat papan game
    drawPacman(); // Gambar Pacman
    drawGhosts(); // Gambar hantu
    updateScore(); // Perbarui skor
    updateLives(); // Perbarui nyawa
    
    // Set volume default untuk semua suara
    eatSound.volume = 0.7;
    backgroundSound.volume = 0.5;
    gameoverSound.volume = 0.7;
    victorySound.volume = 0.7;
}

// Jalankan inisialisasi saat halaman dimuat
init();