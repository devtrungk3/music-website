let serverUrl = "http://127.0.0.1:3000";
let songId ="";
let playlistId = ""
let artistId = ""
let genreId = ""
let userId=""
let favoriteSongIds = []
let isFavorite = false;
let historyAdded = false; // New variable to track if history has been added

 let playingList = [
        {
            title: "Dư báo thời tiết hôm nay mưa",
            artist: "Grey D",
            audio: "assets/audio/dự-báo-thời-tiết-hôm-nay-mưa_grey-d.mp3",
            image: "./assets/image/25.jpg"
        },
        {
            title: "Xin đừng lặng im",
            artist: "Soobin Hoàng Sơn",
            audio: "./assets/audio/xin-đừng-lặng-im_soobin.mp3",
            image: "./assets/image/1084.jpg"
        },
        {
            title: "Đưa em về nhà",
            artist: "Grey D",
            audio: "./assets/audio/đưa-em-về-nhàa_grey-d.mp3",
            image: "./assets/image/5.jpg"
        },
        {
            title: "Vài câu nói có khiến người thay đỏi",
            artist: "Grey D",
            audio: "./assets/audio/vaicaunoicokhiennguoithaydoi_grey-d.mp3",
            image: "./assets/image/11.jpg"
        }
        // Add more songs here
    ];



async function fetchSongDetail(songDetailId) {
    songId=songDetailId;
    isFavorite = await checkFavorite(songId);
    songDetailContent.classList.add('active');
    songListContent.classList.remove('active');
    homeContent.classList.remove('active');
    searchContent.classList.remove('active');
    libraryContent.classList.remove('active');
    try {
        const songDetailResponse = await fetch(serverUrl + `/songs/${songDetailId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (songDetailResponse.ok) {
            const songDetail = await songDetailResponse.json();
            console.log(songDetail);
            displaySongDetails(songDetail);
           await  updateHeartIcon(songId); // Update heart icon after fetching song details
           historyAdded = false; // Reset history flag
           playingList = [];    
           playingList.push({
            id: songDetail.song.id,
            title: songDetail.song.title,
            image: `${serverUrl}${songDetail.song.image}`,
            audio: `${serverUrl}${songDetail.song.audio}`,
            artists: songDetail.artists 
            });
                   // Sử dụng JSON.stringify để hiển thị đối tượng chi tiết
        console.log("playingList:", JSON.stringify(playingList, null, 2));
                  if (playingList.length > 0) {
                    await loadSong(0); // Play the first song
                }
        } else {
            console.error('Failed to fetch song details:', songDetailResponse.statusText);
        }
    } catch (error) {
        console.error('Error fetching song details:', error.message);
    }
}

function displaySongDetails(songDetails) {
    const songTitleElement = document.getElementById("songTitle");
    const songImageElement = document.getElementById("songImage");
    const songReleasedYearElement = document.getElementById("songReleasedYear");
    const songArtistElement = document.getElementById("songArtist");
    const songGenresListElement = document.getElementById("songGenre");
   
    console.log(songDetails);

    songTitleElement.textContent = songDetails.song.title;
    songReleasedYearElement.textContent = songDetails.song.releasedYear;
    songArtistElement.textContent = songDetails.artists.map(artist => artist.fullname).join(', ');
    songImageElement.src = serverUrl + songDetails.song.image;
    while (songGenresListElement.firstChild) {
        songGenresListElement.removeChild(songGenresListElement.firstChild);
    }

    songDetails.genres.forEach(genre => {
        songGenresListElement.textContent += `| ${genre.title} | `;
    });

   
}

// Function to add song to history
async function addToHistory(songId) {
    try {
        const response = await fetch(`${serverUrl}/history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ songId })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('History add response:', data.success);
        } else {
            console.error('Failed to add song to history:', response.statusText);
        }
    } catch (error) {
        console.error('Error adding song to history:', error.message);
    }
}


function playSong(audioUrl) {
    if (music) {
        music.pause();
    }
    music = new Audio(serverUrl + audioUrl);

    if (music.paused || music.currentTime <= 0) {
        music.play();
        masterPlay.classList.remove("bi-play-fill");
        masterPlay.classList.add("bi-pause-fill");
        wave.classList.add('active2');
    } else {
        music.pause();
        masterPlay.classList.remove("bi-pause-fill");
        masterPlay.classList.add("bi-play-fill");
        wave.classList.remove('active2');
    }
}

async function checkFavorite(songId) {
    // Clear favoriteSongIds array
    favoriteSongIds = [];
    const response = await fetch(`${serverUrl}/favorites`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });

    if (response.ok) {
        const data = await response.json();
        const songs = data.songs;
        songs.forEach(song => {
            favoriteSongIds.push(song.id);
        });
        console.log("Favorite Song IDs:", favoriteSongIds); // Debugging log
    } else {
        console.error('Failed to fetch favorites:', response.statusText);
    }

    const songIdNum = Number(songId); // Convert songId to number for comparison
    const isFavorite = favoriteSongIds.includes(songIdNum);
    
    if (isFavorite) {
        console.log(`Bài hát có ID ${songId} nằm trong danh sách yêu thích.`);
    } else {
        console.log(`Bài hát có ID ${songId} không nằm trong danh sách yêu thích.`);
    }
    
    return isFavorite;
}

async function updateHeartIcon(songId) {
    const heartIcon = document.getElementById("heartIcon");
    isFavorite = await checkFavorite(songId); // Await checkFavorite to ensure isFavorite is set correctly

    if (isFavorite) {
        heartIcon.classList.remove("bi-heart");
        heartIcon.classList.add("bi-heart-fill");
    } else {
        heartIcon.classList.remove("bi-heart-fill");
        heartIcon.classList.add("bi-heart");
    }

    heartIcon.removeEventListener("click", handleHeartIconClick); // Remove any existing listeners
    heartIcon.addEventListener("click", handleHeartIconClick); // Add the new listener
}

async function handleHeartIconClick() {
    if (isFavorite) {
        try {
            const response = await fetch(serverUrl + `/favorites/${songId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
            });

            if (response.ok) {
                alert("đã xóa khỏi mục yêu thích!");
                isFavorite = false; // Update the isFavorite status
                await updateHeartIcon(songId); // Update the heart icon after removing from favorites
            } else {
                console.error(`Failed to remove from favorites:`, response.statusText);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    } else {
        try {
            const response = await fetch(serverUrl + `/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ songId })
            });

            if (response.ok) {
                alert('đã thêm vào mục yêu thích!');
                isFavorite = true; // Update the isFavorite status
                await updateHeartIcon(songId); // Update the heart icon after adding to favorites
                location.reload();
                // fetchSongDetail(songId);
            } else {
                console.error(`Failed to add to favorites:`, response.statusText);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
}



const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeElem = document.getElementById('currentTime');
const totalTimeElem = document.getElementById('totalTime');
const volumeBar = document.getElementById('volumeBar');
const muteBtn = document.getElementById('muteBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let isShuffled = false;
let isRepeated = false;
let repeatOne = false;
let currentSongIndex = 0;


async function loadSong(songIndex) {
    if (songIndex < 0 || songIndex >= playingList.length) {
        console.error('Invalid song index:', songIndex);
        return;
    }

    const { audio, title, artists, image } = playingList[songIndex];
    const artistNames = artists.map(artist => artist.fullname).join(', ');

    const songPlayBarTitle = document.getElementById('songPlayBarTitle');
    const songPlayBarArtist = document.getElementById('songPlayBarArtist');
    const songPlayBarImage = document.getElementById('songPlayBarImage');
    const audioPlayer = document.getElementById('audioPlayer');

    audioPlayer.src = audio;
    songPlayBarTitle.textContent = title;
    songPlayBarArtist.textContent = artistNames;
    songPlayBarImage.src = image;

     // Reset play/pause button to default play icon
     audioPlayer.pause();
     audioPlayer.currentTime = 0;
     playPauseBtn.src = './assets/play.png';

     audioPlayer.addEventListener('timeupdate', async () => {
        if (!historyAdded && audioPlayer.currentTime > 10) { // Adjust the time threshold as needed
            await addToHistory(songId);
            historyAdded = true; // Ensure it is added only once
        }
    });
   
    // audioPlayer.play().then(() => {
    //     playPauseBtn.src = './assets/pause.png';
    // }).catch(error => {
    //     console.error('Error playing audio:', error);
    // });
}

document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progressBar');
    const currentTimeElem = document.getElementById('currentTime');
    const totalTimeElem = document.getElementById('totalTime');
    const volumeBar = document.getElementById('volumeBar');
    const muteBtn = document.getElementById('muteBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let isShuffled = false;
    let isRepeated = false;
    let repeatOne = false;
    let playedIndices = [];
    let currentSongIndex = 0;

    // Update play/pause button
    const updatePlayPauseIcon = () => {
        playPauseBtn.src = audioPlayer.paused ? './assets/play.png' : './assets/pause.png';
    };

    // Play or pause the audio
    playPauseBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
        updatePlayPauseIcon();
    });

    // Update the progress bar as the audio plays
    audioPlayer.addEventListener('timeupdate', () => {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progress;

        const currMinutes = Math.floor(audioPlayer.currentTime / 60);
        const currSeconds = Math.floor(audioPlayer.currentTime % 60).toString().padStart(2, '0');
        currentTimeElem.textContent = `${currMinutes}:${currSeconds}`;
    });

    // Update audio time when progress bar is changed
    progressBar.addEventListener('input', () => {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    });

    // Update the total time when the metadata is loaded
    audioPlayer.addEventListener('loadedmetadata', () => {
        const totalMinutes = Math.floor(audioPlayer.duration / 60);
        const totalSeconds = Math.floor(audioPlayer.duration % 60).toString().padStart(2, '0');
        totalTimeElem.textContent = `${totalMinutes}:${totalSeconds}`;
    });

    // Volume control
    volumeBar.addEventListener('input', () => {
        audioPlayer.volume = volumeBar.value / 100;
    });

    // Mute/Unmute control
    muteBtn.addEventListener('click', () => {
        audioPlayer.muted = !audioPlayer.muted;
        muteBtn.src = audioPlayer.muted ? './assets/mute.png' : './assets/non-mute.png';
    });

    // Shuffle control
    shuffleBtn.addEventListener('click', () => {
        isShuffled = !isShuffled;
        shuffleBtn.classList.toggle('active', isShuffled);
        playedIndices = [];
    });

    // Repeat control
    repeatBtn.addEventListener('click', () => {
        if (!isRepeated) {
            isRepeated = true;
            repeatOne = false;
        } else if (isRepeated && !repeatOne) {
            repeatOne = true;
        } else {
            isRepeated = false;
            repeatOne = false;
        }
        repeatBtn.classList.toggle('active', isRepeated);
        repeatBtn.classList.toggle('repeat-one', repeatOne);
    });

    // Load the previous song
    const loadPreviousSong = () => {
        currentSongIndex = (currentSongIndex - 1 + playingList.length) % playingList.length;
        loadSong(currentSongIndex);
        audioPlayer.play();
        updatePlayPauseIcon();
    };

    // Load the next song
    const loadNextSong = () => {
        if (isShuffled) {
            let randomIndex;
            if (playedIndices.length === playingList.length) {
                playedIndices = [];
            }

            do {
                randomIndex = Math.floor(Math.random() * playingList.length);
            } while (playedIndices.includes(randomIndex));

            playedIndices.push(randomIndex);
            currentSongIndex = randomIndex;
        } else {
            currentSongIndex = (currentSongIndex + 1) % playingList.length;
        }

        loadSong(currentSongIndex);
        audioPlayer.play();
        updatePlayPauseIcon();
    };

    // Event listeners for prevBtn and nextBtn
    prevBtn.addEventListener('click', loadPreviousSong);
    nextBtn.addEventListener('click', loadNextSong);

    // Handle song end
    audioPlayer.addEventListener('ended', () => {
        if (repeatOne) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else if (isRepeated) {
            loadNextSong();
        } else if (isShuffled) {
            loadNextSong();
        } else {
            if (currentSongIndex < playingList.length - 1) {
                currentSongIndex++;
                loadSong(currentSongIndex);
                audioPlayer.play();
            } else {
                audioPlayer.pause();
                currentSongIndex = 0;
                loadSong(currentSongIndex);
            }
        }
    });

    // Initialize the player
    loadSong(currentSongIndex);
    updatePlayPauseIcon();
    volumeBar.value = audioPlayer.volume * 100;
});
