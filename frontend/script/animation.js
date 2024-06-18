// chuyển tab

let homeSideBar = document.getElementById('home');
let searchSideBar = document.getElementById('search');
let librarySideBar = document.getElementById('library');

let homeContent = document.getElementById('homeContent');
let searchContent = document.getElementById('searchContent');
let libraryContent = document.getElementById('libraryContent');
let songListContent = document.getElementById('songListContent');
let songDetailContent = document.getElementById('songDetailContent');

let sticky_nav_search = document.getElementsByClassName('sticky_nav_search')[0];

homeSideBar.addEventListener('click', () => {
    homeSideBar.classList.add('active');
    searchSideBar.classList.remove('active');
    librarySideBar.classList.remove('active');
    
    homeContent.classList.add('active');
    searchContent.classList.remove('active');
    libraryContent.classList.remove('active');
    songListContent.classList.remove('active');
    songDetailContent.classList.remove('active');

    sticky_nav_search.classList.add('none_active')
});

searchSideBar.addEventListener('click', () => {
    homeSideBar.classList.remove('active');
    searchSideBar.classList.add('active');
    librarySideBar.classList.remove('active');
    
    homeContent.classList.remove('active');
    searchContent.classList.add('active');
    libraryContent.classList.remove('active');
    songListContent.classList.remove('active');
    songDetailContent.classList.remove('active');

    sticky_nav_search.classList.remove('none_active')
});

librarySideBar.addEventListener('click', () => {
    searchSideBar.classList.remove('active');
    homeSideBar.classList.remove('active');
    librarySideBar.classList.add('active');
    
    homeContent.classList.remove('active');
    searchContent.classList.remove('active');
    libraryContent.classList.add('active');
    songListContent.classList.remove('active');
    songDetailContent.classList.remove('active');

    sticky_nav_search.classList.add('none_active')
});


// dialog

// --------------------------Dialog add to playlist-------------------------
document.querySelectorAll('.bi-music-note-list').forEach(function (element) {
    element.addEventListener('click', function () {
        document.getElementById('addToPlaylistDialog').style.display = 'block';
        fetchAndDisplayPlaylists();
    });
});

document.querySelector('.dialog .close').addEventListener('click', function () {
    document.getElementById('addToPlaylistDialog').style.display = 'none';
});

window.addEventListener('click', function (event) {
    if (event.target == document.getElementById('addToPlaylistDialog')) {
        document.getElementById('addToPlaylistDialog').style.display = 'none';
    }
});

// --------------------------Dialog update playlist-------------------------

let updatePlaylistBtn = document.querySelector('.updatePlaylistBtn');
let updatePlaylistDialog = document.getElementById('updatePlaylistDialog');

updatePlaylistBtn.addEventListener('click', function () {
    updatePlaylistDialog.style.display = 'block';
});

document.querySelector('.dialog .close').addEventListener('click', function () {
    updatePlaylistDialog.style.display = 'none';
});

window.addEventListener('click', function (event) {
    if (event.target == updatePlaylistDialog) {
        updatePlaylistDialog.style.display = 'none';
    }
});

// --------------------------Dialog create new playlist-------------------------

let createNewPlaylistBtn = document.querySelector('.createNewPlaylistBtn');
let createNewPlaylistDialog = document.getElementById('createNewPlaylistDialog');

createNewPlaylistBtn.addEventListener('click', function () {
    createNewPlaylistDialog.style.display = 'block';
});


document.querySelector('.dialog .close').addEventListener('click', function () {
    createNewPlaylistDialog.style.display = 'none';
});

window.addEventListener('click', function (event) {
    if (event.target == createNewPlaylistDialog) {
        createNewPlaylistDialog.style.display = 'none';
    }
});


