let selectedArtistId;
let selectedArtistFullName;

document.addEventListener('DOMContentLoaded', async () => {
    const page = 1;
    const pageSize = 5;
    const artistContainer = document.getElementById('listArtist');

    try {
        // Fetching artists data
        const response = await fetch(`${serverUrl}/artists?page=${page}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch artists: ${response.statusText}`);
        }

        const data = await response.json();
        const artists = data.artists;

        // Populate artist list
        artists.forEach(artist => {
            const artistItem = document.createElement('div');
            artistItem.classList.add('itemArtist');
            artistItem.dataset.artistId = artist.id;
            artistItem.dataset.artistFullName = artist.fullname;
            artistItem.innerHTML = `
                <div class="card">
                    <img src="${serverUrl + artist.image}" alt="./assets/card2img.jpg" class="card-circle-img">
                    <i class="bi bi-play-circle-fill icon-overlay"></i>
                    <p class="card-title">${artist.fullname}</p>
                </div>
            `;
            artistContainer.appendChild(artistItem);
        });

        // Event listener for artist selection
        artistContainer.addEventListener('click', event => {
            const itemArtist = event.target.closest('.itemArtist');
            if (itemArtist) {
                selectedArtistId = itemArtist.dataset.artistId;
                selectedArtistFullName = itemArtist.dataset.artistFullName;
                fetchSongArtist(selectedArtistId, selectedArtistFullName);
            }
        });

    } catch (error) {
        console.error('Error fetching artists:', error.message);
        alert('There was an error loading the artists. Please try again later.');
    }
});

async function fetchSongArtist(artistId, artistFullName) {
    songListContent.classList.add('active');
    songDetailContent.classList.remove('active');
    homeContent.classList.remove('active');
    searchContent.classList.remove('active');
    libraryContent.classList.remove('active');
    try {
        // Fetching songs by artist
        const response = await fetch(`${serverUrl}/artists/${artistId}/songs`, {
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

        const artist = data.artist;
        const songs = data.songs;
        const songArtist = document.getElementById('songList');
        songArtist.innerHTML = '';

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
                        <div class="subtitle">${artistFullName}</div>
                    </h5>
                `;
                songArtist.appendChild(songItem);
            });

            // Ensure the event listener is only added once
            songArtist.removeEventListener('click', songClickHandler);
            songArtist.addEventListener('click', songClickHandler);

        } else {
            console.error('Songs data is not an array:', songs);
            alert('Unexpected data format. Please try again later.');
        }
    } catch (error) {
        console.error('Error fetching songs:', error.message);
        alert('There was an error loading the songs. Please try again later.');
    }
}

async function songClickHandler(event) {
    const itemSong = event.target.closest('.itemSong');
    if (itemSong) {
        const songId = itemSong.dataset.songId;
        await fetchSongDetail(songId);
    }
}
