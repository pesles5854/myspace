// Harry Potter MySpace Interactive Script

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. MOUSE TRAIL EFFECT (Blesky, Hůlky, Lektvary)
  // ==========================================
  const trailSymbols = ['⚡', '🪄', '🧪', '✨'];
  let lastX = 0;
  let lastY = 0;

  document.addEventListener('mousemove', (e) => {
    // Distance threshold to avoid creating too many elements
    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    if (dist < 25) return;

    lastX = e.clientX;
    lastY = e.clientY;

    const particle = document.createElement('span');
    particle.className = 'trail-particle';
    particle.textContent = trailSymbols[Math.floor(Math.random() * trailSymbols.length)];
    particle.style.left = `${e.clientX}px`;
    particle.style.top = `${e.clientY}px`;

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 800);
  });


  // ==========================================
  // 2. SNAKE GAME (Harry Potter sbírá hůlky 🪄)
  // ==========================================
  const canvas = document.getElementById('snake-game');
  const ctx = canvas.getContext('2d');
  const currentScoreEl = document.getElementById('current-score');
  const highScoreEl = document.getElementById('high-score');
  const overlay = document.getElementById('game-overlay');
  const overlayTitle = document.getElementById('overlay-title');
  const startBtn = document.getElementById('start-game-btn');

  const gridSize = 20;
  const tileCountX = canvas.width / gridSize; // 20 tiles
  const tileCountY = canvas.height / gridSize; // 15 tiles

  let snake = [];
  let dx = gridSize;
  let dy = 0;
  let wand = { x: 0, y: 0 };
  let score = 0;
  let highScore = 0;
  let gameInterval = null;
  let isGameRunning = false;

  function initGame() {
    snake = [
      { x: 5 * gridSize, y: 5 * gridSize },
      { x: 4 * gridSize, y: 5 * gridSize },
      { x: 3 * gridSize, y: 5 * gridSize }
    ];
    dx = gridSize;
    dy = 0;
    score = 0;
    currentScoreEl.textContent = score;
    spawnWand();
  }

  function spawnWand() {
    wand.x = Math.floor(Math.random() * tileCountX) * gridSize;
    wand.y = Math.floor(Math.random() * tileCountY) * gridSize;

    // Check if wand spawned on snake body
    snake.forEach(segment => {
      if (segment.x === wand.x && segment.y === wand.y) {
        spawnWand();
      }
    });
  }

  function gameLoop() {
    updateGame();
    drawGame();
  }

  function updateGame() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wall collision (Game Over)
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
      endGame();
      return;
    }

    // Self collision (Game Over)
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        endGame();
        return;
      }
    }

    snake.unshift(head);

    // Collect Wand
    if (head.x === wand.x && head.y === wand.y) {
      score += 10;
      currentScoreEl.textContent = score;
      if (score > highScore) {
        highScore = score;
        highScoreEl.textContent = highScore;
      }
      spawnWand();
    } else {
      snake.pop();
    }
  }

  function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#1a252f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Wand 🪄
    ctx.font = '16px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🪄', wand.x + gridSize / 2, wand.y + gridSize / 2);

    // Draw Harry Snake ⚡
    snake.forEach((segment, index) => {
      if (index === 0) {
        // Head (Harry)
        ctx.fillStyle = '#eeba30'; // Gold
        ctx.beginPath();
        ctx.arc(segment.x + gridSize / 2, segment.y + gridSize / 2, gridSize / 2 - 1, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#740001';
        ctx.font = '12px sans-serif';
        ctx.fillText('⚡', segment.x + gridSize / 2, segment.y + gridSize / 2);
      } else {
        // Body
        ctx.fillStyle = index % 2 === 0 ? '#740001' : '#eeba30';
        ctx.fillRect(segment.x + 1, segment.y + 1, gridSize - 2, gridSize - 2);
      }
    });
  }

  function startGame() {
    initGame();
    overlay.style.display = 'none';
    isGameRunning = true;
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 120);
  }

  function endGame() {
    clearInterval(gameInterval);
    isGameRunning = false;
    overlayTitle.textContent = `Konec hry! Získal jsi ${score} bodů! ⚡`;
    startBtn.textContent = 'Hrát znovu 🔄';
    overlay.style.display = 'flex';
  }

  startBtn.addEventListener('click', startGame);

  // Keyboard Controls
  document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;

    const key = e.key.toLowerCase();

    // Prevent scrolling with arrows
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
      e.preventDefault();
    }

    if ((key === 'arrowup' || key === 'w') && dy === 0) {
      dx = 0;
      dy = -gridSize;
    } else if ((key === 'arrowdown' || key === 's') && dy === 0) {
      dx = 0;
      dy = gridSize;
    } else if ((key === 'arrowleft' || key === 'a') && dx === 0) {
      dx = -gridSize;
      dy = 0;
    } else if ((key === 'arrowright' || key === 'd') && dx === 0) {
      dx = gridSize;
      dy = 0;
    }
  });


  // ==========================================
  // 3. MUSIC PLAYER INTERACTIVITY
  // ==========================================
  const songs = [
    { title: "Hedwig's Theme", artist: "John Williams" },
    { title: "Do The Hippogriff", artist: "Sušené Žáby" },
    { title: "A Cauldron Full of Hot Love", artist: "Celestina Warbeck" }
  ];

  let currentSongIndex = 0;
  let isPlaying = false;

  const songTitleEl = document.getElementById('song-title');
  const songArtistEl = document.getElementById('song-artist');
  const playBtn = document.getElementById('play-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  function updateSong() {
    songTitleEl.textContent = songs[currentSongIndex].title;
    songArtistEl.textContent = songs[currentSongIndex].artist;
  }

  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playBtn.textContent = isPlaying ? "⏸ Pozastavit" : "▶ Přehrát";
  });

  prevBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    updateSong();
  });

  nextBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    updateSong();
  });


  // ==========================================
  // 4. COMMENTS WALL FORM
  // ==========================================
  const commentForm = document.getElementById('comment-form');
  const commentsList = document.getElementById('comments-list');

  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('comment-name');
    const textInput = document.getElementById('comment-text');

    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (name && text) {
      const newComment = document.createElement('div');
      newComment.className = 'comment-item';

      const now = new Date();
      const timeStr = `Dnes ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      newComment.innerHTML = `
        <div class="comment-header">
          <strong>${escapeHtml(name)}</strong>
          <span class="comment-time">${timeStr}</span>
        </div>
        <p>${escapeHtml(text)}</p>
      `;

      commentsList.prepend(newComment);

      nameInput.value = '';
      textInput.value = '';

      alert('Vzkaz byl úspěšně přidán na Harryho nástěnku! ✨');
    }
  });

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Initial draw of canvas background
  ctx.fillStyle = '#1a252f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

});
