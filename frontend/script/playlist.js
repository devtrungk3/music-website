let selectedPlaylistId;  // Global variable to store the selected playlist ID

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`${serverUrl}/playlists`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const playlists = data.playlists;
            const playlistContainer = document.getElementById('playlistContainer');

            playlists.forEach(playlist => {
                const playlistItem = document.createElement('div');
                playlistItem.classList.add('itemPlaylist');
                playlistItem.dataset.playlistId = playlist.id;
                playlistItem.innerHTML = `
                    <div class="card">
                        <img src="./assets/card2img.jpg" alt="Playlist Image" class="card-img">
                        <p class="card-title">${playlist.title}</p>                  
                    </div>`;
                playlistContainer.appendChild(playlistItem);
            });

            playlistContainer.addEventListener('click', event => {
                const itemPlaylist = event.target.closest('.itemPlaylist');
                if (itemPlaylist) {
                    selectedPlaylistId = itemPlaylist.dataset.playlistId;  // Set the selected playlist ID
                    songListContent.classList.add('active');
                    songDetailContent.classList.remove('active');
                    homeContent.classList.remove('active');
                    searchContent.classList.remove('active');
                    libraryContent.classList.remove('active');
                    let updatePlaylist = document.getElementById('updatePlaylist');
                    updatePlaylist.style.display = 'block';
                    let removePlaylist = document.getElementById('removePlaylist');
                    removePlaylist.style.display = 'block';
                    fetchSongPlaylist(selectedPlaylistId);
                   
                }
            });
        } else {
            console.error('Failed to fetch playlists:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching playlists:', error.message);
    }
});

async function fetchSongPlaylist(playlistId) {
    try {
        const response = await fetch(`${serverUrl}/playlists/${playlistId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const songs = data.songs;  // Adjust according to actual data structure
            
            const songPlaylist = document.getElementById('songList');
            songPlaylist.innerHTML = '';  // Clear the current playlist content
            console.log(songs);  // Log the data to inspect its structure
            
            if (Array.isArray(songs)) {
                // Update playing list
                playingList = songs.map(song => ({
                    id: song.id,
                    title: song.title,
                    image: `${serverUrl}${song.image}`,
                    audio: `${serverUrl}${song.audio}`,
                    artists: song.artists
                }));
                
                console.log("songs:", JSON.stringify(songs, null, 2)); // Better log for songs
                console.log("playingList:", JSON.stringify(playingList, null, 2)); // Better log for playingList


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
                        <div class="icons">
                            <i class="bi bi-trash"></i>
                        </div>`;
                    songPlaylist.appendChild(songItem);
                });



                songPlaylist.addEventListener('click', async event => {
                    const itemSong = event.target.closest('.itemSong');
                    const songId = itemSong.dataset.songId;
                    if (event.target.classList.contains('bi-trash')) {
                        await removeSongFromPlaylist(songId, playlistId);
                    } else if (itemSong) {
                        await fetchSongDetail(songId);
                    }
                });

                
                // Load the first song from the playlist
                if (playingList.length > 0) {
                await loadSong(0); // Play the first song
                }
            } else {
                console.error('Songs data is not an array:', songs);
            }
        } else {
            console.error('Failed to fetch songs:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching songs:', error.message);
    }
}

// Form submission for updating playlist
document.getElementById('updatePlaylistForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const newTitle = document.getElementById('new_Title_Playlist').value;
    const newDescription = document.getElementById('new_Description_Playlist').value;

    try {
        const response = await fetch(`${serverUrl}/playlists/${selectedPlaylistId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                title: newTitle,
                description: newDescription
            })
        });

        console.log('Response status:', response.status);  // Log response status
        console.log('Response status text:', response.statusText);  // Log response status text

        const responseText = await response.text();  // Read the response as text
        console.log('Response text:', responseText);  // Log the raw response text

        let data;
        try {
            data = JSON.parse(responseText);  // Try to parse the response as JSON
            console.log('Parsed response data:', data);  // Log the parsed response data
        } catch (e) {
            console.error('Failed to parse response as JSON:', e);
            alert('Failed to update playlist: Invalid response format');
            return;
        }

        if (response.ok) {
            if (data.success) {
                alert('Playlist updated successfully!');
                window.location.reload();
            } else {
                alert('Failed to update playlist: ' + (data.message || 'Unknown error'));
            }
        } else {
            alert('Failed to update playlist: ' + (data.message || response.statusText));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});



// Form submission for creating a new playlist
document.getElementById('createPlaylistForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const title = document.getElementById('title_Playlist').value;
    const description = document.getElementById('description_Playlist').value;

    try {
        const response = await fetch(`${serverUrl}/playlists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                title,
                description
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success === "playlist created successfully") {
                alert('Playlist created successfully!');
                window.location.reload();
            } else {
                alert('Failed to create playlist');
            }
        } else {
            alert('Failed to create playlist');
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
});



// remove playlist
document.getElementById('removePlaylist').addEventListener('click', async (event) => {

    try {
        const response = await fetch(`${serverUrl}/playlists/${selectedPlaylistId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
        });
       
        if (response.ok) {
           alert("Your playlist has been removed!" );
           location.reload();
        } else {
            const data = await response.json(); // Đọc dữ liệu lỗi từ response
            alert('Failed to remove playlist: ' + (data.message || response.statusText));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});


async function removeSongFromPlaylist(songId, playlistId){
    try {
        const response = await fetch(serverUrl + `/playlists/${playlistId}/song`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
               songId
            })
        });

        if (response.ok) {
            alert("đã xóa khỏi playlist!");
            location.reload();
        } else {
            console.error(`Failed to remove from favorites:`, response.statusText);
            alert(`Failed to remove from favorites:`, response.statusText);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }

}




// Function to fetch playlists and display them in the dialog
async function fetchAndDisplayPlaylists() {
    try {
        const response = await fetch(`${serverUrl}/playlists`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const playlists = data.playlists;
            const playlistRange = document.getElementById('playlistRange');

            // Clear existing content
            playlistRange.innerHTML = '';

            playlists.forEach(playlist => {
                const playlistItem = document.createElement('div');
                playlistItem.classList.add('itemPlaylist');
                playlistItem.innerHTML = `
                    <input class="checkboxPlaylist" type="checkbox" id="${playlist.id}" name="playlist" value="${playlist.id}">
                    <label for="${playlist.id}">${playlist.title}</label><br>`;
                playlistRange.appendChild(playlistItem);
            });
        } else {
            console.error('Failed to fetch playlists:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching playlists:', error.message);
    }
}



// Event listener for checkboxes in the playlist dialog
document.getElementById('playlistRange').addEventListener('change', async function (event) {
    const checkbox = event.target;
    if (checkbox.classList.contains('checkboxPlaylist')) {
        const playlistId = checkbox.value;
        const accessToken = localStorage.getItem('accessToken');

        try {
            const response = await fetch(`${serverUrl}/playlists/${playlistId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ songId })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    alert(data.success);
                } else if (data.error) {
                    alert(data.error);
                } else {
                    alert('Unknown error occurred.');
                }
            } else {
                alert('Failed to add song to playlist: ' + response.statusText);
            }
        } catch (error) {
            alert('Error adding song to playlist: ' + error.message);
        }
    }
});