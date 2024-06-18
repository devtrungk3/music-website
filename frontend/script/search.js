const searchInput = document.getElementById('searchInput');
const songSearch = document.getElementById('songSearch');
let timeoutId;

searchInput.addEventListener('keyup', () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        const searchContent = searchInput.value;
        songSearch.innerHTML = '';
        if (searchContent) {
            // Fetch songs
            const songUrl = serverUrl + `/songs?title=${encodeURIComponent(searchContent)}`;
            fetch(songUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.songs.length > 0) {
                        const songHeader = document.createElement('h2');
                        songHeader.textContent = 'Songs';
                        songSearch.appendChild(songHeader);
                    }
                    data.songs.forEach((song, index) => {
                        const songItem = document.createElement('li');
                        songItem.classList.add('songItem');
                        songItem.setAttribute('id', `song-${song.id}`);

                        const songIndex = document.createElement('span');
                        songIndex.textContent = index + 1;

                        const songImage = document.createElement('img');
                        songImage.src = serverUrl + song.image;
                        songImage.alt = song.artists[0].fullname;

                        const songDetails = document.createElement('h5');
                        const songTitle = document.createTextNode(song.title);
                        const songArtists = document.createElement('div');
                        songArtists.classList.add('subtitle');
                        songArtists.textContent = song.artists.map(artist => artist.fullname).join(', ');

                        songDetails.appendChild(songTitle);
                        songDetails.appendChild(songArtists);

                        songItem.appendChild(songIndex);
                        songItem.appendChild(songImage);
                        songItem.appendChild(songDetails);

                        songItem.addEventListener('click', () => {
                            fetchSongDetail(song.id);
                        });

                        songSearch.appendChild(songItem);
                    });
                    songSearch.style.display = 'block';
                })
                .catch(error => console.error('Error fetching songs:', error));

            // Fetch artists
            const artistUrl = serverUrl + `/artists?fullname=${encodeURIComponent(searchContent)}`;
            fetch(artistUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.artists.length > 0) {
                        const artistHeader = document.createElement('h2');
                        artistHeader.textContent = 'Artists';
                        songSearch.appendChild(artistHeader);
                    }
                    data.artists.forEach((artist, index) => {
                        const artistItem = document.createElement('li');
                        artistItem.classList.add('artistItem');
                        artistItem.setAttribute('id', `artist-${artist.id}`);

                        const artistIndex = document.createElement('span');
                        artistIndex.textContent = index + 1;

                        const artistImage = document.createElement('img');
                        artistImage.src = serverUrl + artist.image;
                        artistImage.alt = artist.fullname;

                        const artistDetails = document.createElement('h5');
                        const artistName = document.createTextNode(artist.fullname);

                        artistDetails.appendChild(artistName);

                        artistItem.appendChild(artistIndex);
                        artistItem.appendChild(artistImage);
                        artistItem.appendChild(artistDetails);

                        artistItem.addEventListener('click', () => {
                            fetchSongArtist(artist.id, artist.fullname);
                        });

                        songSearch.appendChild(artistItem);
                    });
                    songSearch.style.display = 'block';
                })
                .catch(error => console.error('Error fetching artists:', error));

            // Fetch genres
            const genreUrl = serverUrl + `/genres?title=${encodeURIComponent(searchContent)}`;
            fetch(genreUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.genres.length > 0) {
                        const genreHeader = document.createElement('h2');
                        genreHeader.textContent = 'Genres';
                        songSearch.appendChild(genreHeader);
                    }
                    data.genres.forEach((genre, index) => {
                        const genreItem = document.createElement('li');
                        genreItem.classList.add('genreItem');
                        genreItem.setAttribute('id', `genre-${genre.id}`);

                        const genreIndex = document.createElement('span');
                        genreIndex.textContent = index + 1;

                        const genreImage = document.createElement('img');
                        genreImage.src = "./assets/genre-image4.jpg";
                        genreImage.alt = genre.title;

                        const genreDetails = document.createElement('h5');
                        const genreTitle = document.createTextNode(genre.title);

                        genreDetails.appendChild(genreTitle);

                        genreItem.appendChild(genreIndex);
                        genreItem.appendChild(genreImage);
                        genreItem.appendChild(genreDetails);

                        genreItem.addEventListener('click', () => {
                            fetchSongGenre(genre.id);
                        });

                        songSearch.appendChild(genreItem);
                    });
                    songSearch.style.display = 'block';
                })
                .catch(error => console.error('Error fetching genres:', error));
        }
    }, 1000); // 1 second delay
});
