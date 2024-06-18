document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(serverUrl + `/history`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (response.ok) {
            const songs = await response.json();
            const historyContainer = document.getElementById('songHistory');
            const limit = 5; // Giới hạn số lượng bài hát hiển thị
            const limitedSongs = songs.slice(0, limit); // Lấy 6 bài hát đầu tiên

            limitedSongs.forEach((song) => {
                const listItem = document.createElement('div');
                listItem.classList.add('itemSong');
                listItem.dataset.songId = song.id;
                listItem.innerHTML = `
                   <div class="card">
                        <img src="${serverUrl + song.image}" alt="./assets/card2img.jpg" class="card-img">
                        <i class="bi bi-play-circle-fill icon-overlay"></i>
                        <p class="card-title">${song.title}</p>
                        <p class="card-info">${song.artists && song.artists.length > 0
                        ? song.artists.map(artist => artist.fullname).join(', ')
                        : 'No artist information available'}</p>
                    </div>
                `;
                historyContainer.appendChild(listItem);
            });

            historyContainer.addEventListener('click', async event => {
                const itemSong = event.target.closest('.itemSong');
                if (itemSong) {
                    const songId = itemSong.dataset.songId;
                    await fetchSongDetail(songId);
                }
            });

        } else {
            console.error('Failed to fetch history:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching play history:', error.message);
    }
});


const showAllHistory = document.getElementById('showAllHistory')
showAllHistory.addEventListener('click', event => {

    songListContent.classList.add('active');
    songDetailContent.classList.remove('active');
    homeContent.classList.remove('active');
    searchContent.classList.remove('active');
    libraryContent.classList.remove('active');
    let updatePlaylist = document.getElementById('updatePlaylist');
    updatePlaylist.style.display = 'none';
    let removePlaylist = document.getElementById('removePlaylist');
    removePlaylist.style.display = 'none';
    fetchSongHistory();

})


async function fetchSongHistory() {
    try {
        // Fetching songs by genre
        const response = await fetch(`${serverUrl}/history`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch songs: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched Songs Data:", JSON.stringify(data, null, 2));

        const songs = data;
        const songHistory = document.getElementById('songList');
        songHistory.innerHTML = '';

        if (Array.isArray(songs)) {
            // Populate song list
            songs.forEach((song, index) => {
                const songItem = document.createElement('li');
                songItem.classList.add('itemSong');
                songItem.dataset.songId = song.id;
                songItem.innerHTML = `
                    <span>${index + 1}</span>
                    <img src="${serverUrl + song.image}" alt="${song.title}">
                    <h5>
                        ${song.title}
                        <div class="subtitle">${song.artists && song.artists.length > 0
                        ? song.artists.map(artist => artist.fullname).join(', ')
                        : 'No artist information available'}</div>
                    </h5>
                `;
                songHistory.appendChild(songItem);
            });

            // Ensure the event listener is only added once
            songHistory.removeEventListener('click', songClickHandler);
            songHistory.addEventListener('click', songClickHandler);

        } else {
            console.error('Songs data is not an array:', songs);
            alert('Unexpected data format. Please try again later.');
        }
    } catch (error) {
        console.error('Error fetching songs:', error.message);
        alert('There was an error loading the songs. Please try again later.');
    }
}


