// MySpace Harry Potter Interactive Features

document.addEventListener('DOMContentLoaded', () => {

  // 1. MUSIC PLAYER INTERACTIVITY
  const songs = [
    { title: "Sušené Žáby - Do The Hippogriff", artist: "Skladba z Vánočního plesu (Ohnivý pohár)" },
    { title: "John Williams - Hedwig's Theme", artist: "Oficiální Bradavická znělka" },
    { title: "The Weird Sisters - Magic Works", artist: "Pomalý ploužák z Nebelevírského večírku" },
    { title: "Celestina Warbeck - A Cauldron Full of Hot Strong Love", artist: "Oblíbená písnička Molly Weasleyové" }
  ];

  let currentSongIndex = 0;
  let isPlaying = false;

  const songTitleEl = document.getElementById('song-title');
  const songArtistEl = document.getElementById('song-artist');
  const playBtn = document.getElementById('play-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const visualizerBars = document.querySelectorAll('.visualizer .bar');

  function updateSong() {
    songTitleEl.textContent = songs[currentSongIndex].title;
    songArtistEl.textContent = songs[currentSongIndex].artist;
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
      playBtn.textContent = "⏸ Pozastavit";
      visualizerBars.forEach(bar => bar.style.animationPlayState = 'running');
    } else {
      playBtn.textContent = "▶ Přehrát";
      visualizerBars.forEach(bar => bar.style.animationPlayState = 'paused');
    }
  }

  playBtn.addEventListener('click', togglePlay);

  prevBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    updateSong();
    if (!isPlaying) togglePlay();
  });

  nextBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    updateSong();
    if (!isPlaying) togglePlay();
  });


  // 2. BOOK FILTER / ACCORDION
  const filterBtns = document.querySelectorAll('.filter-btn');
  const bookItems = document.querySelectorAll('.book-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      bookItems.forEach(item => {
        const bookNumber = item.getAttribute('data-book');
        if (filterValue === 'all' || filterValue === bookNumber) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });


  // 3. COMMENT WALL FORM
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
      const timeStr = `Dnes v ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      newComment.innerHTML = `
        <div class="comment-author">
          <strong>${escapeHtml(name)}</strong>
          <span class="comment-date">${timeStr}</span>
        </div>
        <p>${escapeHtml(text)}</p>
      `;

      commentsList.prepend(newComment);

      // Clear form
      nameInput.value = '';
      textInput.value = '';

      alert('Tůj vzkaz byl úspěšně přidán na Harryho nástěnku! ✨');
    }
  });

  // Helper function to escape HTML string
  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

});
