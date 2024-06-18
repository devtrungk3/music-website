//for you
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`${serverUrl}/users/for-you`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
        });

        if (response.ok) {
            const data = await response.json(); // Parse the JSON response
            const songs = data.slice(0, 5); // Limit to 6 songs
            console.log(songs);
            const songContainer = document.getElementById('forYouContainer');

            songs.forEach(song => {
                const songItem = document.createElement('div');
                songItem.classList.add('itemSong');
                songItem.dataset.songId = song.id;
                songItem.innerHTML = `
                    <div class="card">
                        <img src="${serverUrl}${song.image}" alt="Card image" class="card-img">
                        <i class="bi bi-play-circle-fill icon-overlay"></i>
                        <p class="card-title">${song.title}</p>
                        <p class="card-info">${song.artists && song.artists.length > 0
                            ? song.artists.map(artist => artist.fullname).join(', ')
                            : 'No artist information available'}</p>
                    </div>`;
                songContainer.appendChild(songItem);
            });

            songContainer.addEventListener('click', async event => {
                const itemSong = event.target.closest('.itemSong');
                if (itemSong) {
                    const songId = itemSong.dataset.songId;
                    await fetchSongDetail(songId);
                } 
            });
        } else {
            console.error('Failed to fetch recommended songs', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching recommended songs:', error.message);
    }
});




const showAllForYou = document.getElementById('showAllForYou')
showAllForYou.addEventListener('click', event => {
    
    songListContent.classList.add('active');
    songDetailContent.classList.remove('active');
    homeContent.classList.remove('active');
    searchContent.classList.remove('active');
    libraryContent.classList.remove('active');
    let updatePlaylist = document.getElementById('updatePlaylist');
    updatePlaylist.style.display = 'none';
    let removePlaylist = document.getElementById('removePlaylist');
    removePlaylist.style.display = 'none';
    fetchSongForYou();

})


async function fetchSongForYou() {
    try {
        // Fetching songs by genre
        const response = await fetch(`${serverUrl}/users/for-you`, {
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
        const songForYou = document.getElementById('songList');
       songForYou.innerHTML = '';

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
                songForYou.appendChild(songItem);
            });

            // Ensure the event listener is only added once
            songForYou.removeEventListener('click', songClickHandler);
            songForYou.addEventListener('click', songClickHandler);

        } else {
            console.error('Songs data is not an array:', songs);
            alert('Unexpected data format. Please try again later.');
        }
    } catch (error) {
        console.error('Error fetching songs:', error.message);
        alert('There was an error loading the songs. Please try again later.');
    }
}


// Maybe you would like
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`${serverUrl}/users/maybe-like`, { // Added `${}` to wrap the URL
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (response.ok) {
            const data = await response.json(); // Parse the JSON response
            const songs = data.slice(0, 5); // Limit to 6 songs

            const maybeLikeContainer = document.getElementById('maybeLikeContainer');

            songs.forEach(song => {
                const songItem = document.createElement('div');
                songItem.classList.add('itemSong');
                songItem.dataset.songId = song.id;
                songItem.innerHTML = `
                    <div class="card">
                        <img src="${serverUrl}${song.image}" alt="./assets/card2img.jpg" class="card-img"> <!-- Modified image source -->
                        <i class="bi bi-play-circle-fill icon-overlay"></i>
                        <p class="card-title">${song.title}</p>
                        <p class="card-info">${song.artists && song.artists.length > 0
                            ? song.artists.map(artist => artist.fullname).join(', ')
                            : 'No artist information available'}</p>
                    </div>`;
                maybeLikeContainer.appendChild(songItem);
            });
            maybeLikeContainer.addEventListener('click', async event => {
                const itemSong = event.target.closest('.itemSong');
                if (itemSong) {
                    const songId = itemSong.dataset.songId;         
                    await fetchSongDetail(songId);
                }
            });
        } else {
            console.error('Failed to fetch recommended songs', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching recommended songs:', error.message);
    }
});



const showAllYouLike = document.getElementById('showAllYouLike')
showAllYouLike.addEventListener('click', event => {
    
    songListContent.classList.add('active');
    songDetailContent.classList.remove('active');
    homeContent.classList.remove('active');
    searchContent.classList.remove('active');
    libraryContent.classList.remove('active');
    let updatePlaylist = document.getElementById('updatePlaylist');
    updatePlaylist.style.display = 'none';
    let removePlaylist = document.getElementById('removePlaylist');
    removePlaylist.style.display = 'none';
    fetchSongYouLike();

})
async function fetchSongYouLike() {
    try {
        // Fetching songs by genre
        const response = await fetch(`${serverUrl}/users/maybe-like`, {
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
        const songYouLike = document.getElementById('songList');
       songYouLike.innerHTML = '';

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
                songYouLike.appendChild(songItem);
            });

            // Ensure the event listener is only added once
            songYouLike.removeEventListener('click', songClickHandler);
            songYouLike.addEventListener('click', songClickHandler);

        } else {
            console.error('Songs data is not an array:', songs);
            alert('Unexpected data format. Please try again later.');
        }
    } catch (error) {
        console.error('Error fetching songs:', error.message);
        alert('There was an error loading the songs. Please try again later.');
    }
}


