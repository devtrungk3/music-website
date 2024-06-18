document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(serverUrl + '/favorites', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const songs = data.songs;



            const favoriteContainer = document.getElementById('favoriteContainer');

            songs.forEach(song => {

                const favoriteItem = document.createElement('div');
                favoriteItem.classList.add('itemSong');
                favoriteItem.dataset.songId = song.id;
                favoriteItem.innerHTML = `
                    <div class="card">
                        <img src="${serverUrl + song.image}" alt="./assets/card2img.jpg" class="card-img">
                        <i class="bi bi-play-circle-fill icon-overlay"></i>
                        <p class="card-title">${song.title}</p>
                        <p class="card-info">${song.artists && song.artists.length > 0
                            ? song.artists.map(artist => artist.fullname).join(', ')
                            : 'No artist information available'}
                        </p>
                    </div>`;
                favoriteContainer.appendChild(favoriteItem);
            });

            favoriteContainer.addEventListener('click', async event => {
                const itemSong = event.target.closest('.itemSong');
                if (itemSong) {
                    const songId = itemSong.dataset.songId;   
                    await fetchSongDetail(songId);
                }
            });
        } else {
            console.error('Failed to fetch favorites:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching favorites:', error.message);
    }
});

