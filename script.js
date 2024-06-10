const image = document.getElementById('cover'),
    title = document.getElementById('music-title'),
    artist = document.getElementById('music-artist'),
    currentTimeEl = document.getElementById('current-time'),
    durationEl = document.getElementById('duration'),
    progress = document.getElementById('progress'),
    playerProgress = document.getElementById('player-progress'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    playBtn = document.getElementById('play'),
    background = document.getElementById('bg-img'),
    playlist = document.getElementById('playlist');

const music = new Audio();

const songs = [
    {
        path: 'assets/1.mp3',
        displayName: 'Boogie With Ex',
        cover: 'assets/1.png',
        artist: 'Exte C',
    },
    {
        path: 'assets/2.mp3',
        displayName: 'Yela Ma',
        cover: 'assets/2.jpg',
        artist: 'Hypaphonik',
    },
    {
        path: 'assets/3.mp3',
        displayName: 'Cant return To You',
        cover: 'assets/3.png',
        artist: 'Dustinho',
    }
];

let musicIndex = 0;
let isPlaying = false;

function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    isPlaying = true;
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
    music.play();
}

function pauseMusic() {
    isPlaying = false;
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
    music.pause();
}

function loadMusic(song) {
    music.src = song.path;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    image.src = song.cover;
    background.src = song.cover;
    updateActivePlaylistItem();
}

function changeMusic(direction) {
    musicIndex = (musicIndex + direction + songs.length) % songs.length;
    loadMusic(songs[musicIndex]);
    playMusic();
}

function updateProgressBar() {
    const { duration, currentTime } = music;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
    durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
    currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;
}

function setProgressBar(e) {
    const width = playerProgress.clientWidth;
    const clickX = e.offsetX;
    music.currentTime = (clickX / width) * music.duration;
}

function loadPlaylist() {
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = `${song.displayName} - ${song.artist}`;
        li.setAttribute('data-index', index);
        playlist.appendChild(li);
    });
}

function updateActivePlaylistItem() {
    const items = document.querySelectorAll('#playlist li');
    items.forEach((item, index) => {
        item.classList.toggle('active', index == musicIndex);
    });
}

playlist.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        musicIndex = e.target.getAttribute('data-index');
        loadMusic(songs[musicIndex]);
        playMusic();
    }
});

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMusic(-1));
nextBtn.addEventListener('click', () => changeMusic(1));
music.addEventListener('ended', () => changeMusic(1));
music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);

loadMusic(songs[musicIndex]);
loadPlaylist();
