let selectedGenreId;
let selectedGenreTitle;

document.addEventListener('DOMContentLoaded', async () => {
    const page = 1;
    const pageSize = 5;
    const genreContainer = document.getElementById('listGenre');

    try {
        // Fetching genres data
        const response = await fetch(`${serverUrl}/genres?page=${page}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch genres: ${response.statusText}`);
        }

        const data = await response.json();
        const genres = data.genres;

        // Populate genre list
        genres.forEach(genre => {
            const genreItem = document.createElement('div');
            genreItem.classList.add('itemgenre');
            genreItem.dataset.genreId = genre.id;
            genreItem.innerHTML = `
                <div class="card">
                    <img src="./assets/genre-image4.jpg" alt="./assets/card2img.jpg" class="card-circle-img">
                    <i class="bi bi-play-circle-fill icon-overlay"></i>
                    <p class="card-title">${genre.title}</p>
                </div>
            `;
            genreContainer.appendChild(genreItem);
        });

        // Event listener for genre selection
        genreContainer.addEventListener('click', event => {
            const itemGenre = event.target.closest('.itemgenre');
            if (itemGenre) {
                selectedGenreId = itemGenre.dataset.genreId;
                fetchSongGenre(selectedGenreId);
            }
        });

    } catch (error) {
        console.error('Error fetching genres:', error.message);
        alert('There was an error loading the genres. Please try again later.');
    }
});

async function fetchSongGenre(genreId) {
    songListContent.classList.add('active');
    songDetailContent.classList.remove('active');
    homeContent.classList.remove('active');
    searchContent.classList.remove('active');
    libraryContent.classList.remove('active');
    try {
        // Fetching songs by genre
        const response = await fetch(`${serverUrl}/genres/${genreId}/songs`, {
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

        const genre = data.genre;
        const songs = data.songs;
        const songGenre = document.getElementById('songList');
        songGenre.innerHTML = '';

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
                songGenre.appendChild(songItem);
            });

            // Ensure the event listener is only added once
            songGenre.removeEventListener('click', songClickHandler);
            songGenre.addEventListener('click', songClickHandler);

        } else {
            console.error('Songs data is not an array:', songs);
            alert('Unexpected data format. Please try again later.');
        }
    } catch (error) {
        console.error('Error fetching songs:', error.message);
        alert('There was an error loading the songs. Please try again later.');
    }
}

