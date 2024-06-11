# Music website

## Table of contents
* [Project structure](#project-structure)
* [System requirements](#system-requirements)
* [Database structure](#database-structure)
    * [Users table](#users-table)
    * [Songs table](#songs-table)
    * [Artist table](#artists-table)
    * [Genre table](#genres-table)
    * [Playlists table](#playlists-table)
    * [Songs_artists table](#songs-artists-table)
    * [Songs_genres table](#songs-genres-table)
    * [Favorites table](#favorites-table)
    * [Play_history table](#play-history-table)
    * [Playlists_songs table](#playlists-songs-table)
* [Starting the project](#starting-project)
* [API References](#api-references)
    * [Auth](#api-auth)
    * [User](#api-user)
    * [Song](#api-song)
    * [Artist](#api-artist)
    * [Genre](#api-genre)
    * [Favorite](#api-favorite)
    * [Playlist](#api-playlist)
    * [Play history](#api-history)

<a name="project-structure"></a>
## Project structure
```plaintext
├── frontend (interface for website)
├── main-server: express.js (main server)
└── ml-server: flask (process data using machine learning)
```
<a name="system-requirements"></a>
## System requirements
Requirements to run Project
- **Node.js 18.x**
- **npm**
- **Python 3.x**
- **pip**
- **mysql**

<a name="database-structure"></a>
## Database structure
<a name="users-table"></a>
#### Users table
|Column|Data type|Allow null|Description|
|-|-|-|-|
|id|Integer|No|Primary key, auto increment|
|username|String|No|Unique|
|password|String|No||
|fullname|String|No||
|email|String|No|Unique|
|role|String|No||
|createdAt|Timestamp|No||
|updatedAt|Timestamp|Yes||

<a name="songs-table"></a>
#### Songs table
|Column|Data type|Allow null|Description|
|-|-|-|-|
|id|Integer|No|Primary key, auto increment|
|title|String|No||
|releasedYear|Integer|Yes||
|audio|String|Yes|Path to audio file of song|
|image|String|Yes|Path to image file of song|
|mode|Integer|Yes|Mode of the song (1 - major or 0 - minor)|
|bpm|Float|Yes|Beats per minute|
|popularity|Integer|Yes|The song's popularity|
|danceability|Float|Yes|Percentage indicating how suitable the song is for dancing|
|energy|Float|Yes|Perceived energy level of the song|
|loudness|Float|Yes|Song volume in dB|
|speechiness|Float|Yes|The level of lyrics of the song, the more lyrics, the higher the score|
|acousticness|Float|Yes|Acoustic level of the song|
|liveness|Float|Yes|Presence of live performance elements|
|valence|Float|Yes|Positivity of the song|

<a name="artists-table"></a>
#### Artists table
|Column|Data type|Allow null|Description|
|-|-|-|-|
|id|Integer|No|Primary key, auto increment|
|fullname|String|No||
|nationality|String|No||
|image|String|Yes|Path to image file of artist|

<a name="genres-table"></a>
#### Genres table
|Column|Data type|Allow null|Description|
|-|-|-|-|
|id|Integer|No|Primary key, auto increment|
|title|String|No||

<a name="playlists-table"></a>
#### Playlists table
|Column|Data type|Allow null|Description|
|-|-|-|-|
|id|Integer|No|Primary key, auto increment|
|title|String|No||
|description|String|Yes||
|userId|Integer|No|Foreign key references to Users(id)|

<a name="songs-artists-table"></a>
#### Songs_artists table (Songs - many to many - Artists)
|Column|Data type|Allow null|Description|
|-|-|-|-|
|songId|Integer|No|Primary key, foreign key references to Songs(id)|
|artistId|Integer|No|Primary key, foreign key references to Artists(id)|

<a name="songs-genres-table"></a>
#### Songs_genres table (Songs - many to many - Genres)
|Column|Data type|Allow null|Description|
|-|-|-|-|
|songId|Integer|No|Primary key, foreign key references to Songs(id)|
|genreId|Integer|No|Primary key, foreign key references to Genres(id)|

<a name="favorites-table"></a>
#### Favorites table (Users - many to many - Songs)
|Column|Data type|Allow null|Description|
|-|-|-|-|
|userId|Integer|No|Primary key, foreign key references to Users(id)|
|songId|Integer|No|Primary key, foreign key references to Songs(id)|
|createdAt|Timestamp|No||
|updatedAt|Timestamp|Yes||

<a name="play-history-table"></a>
#### Play_history table (Users - many to many - Songs)
|Column|Data type|Allow null|Description|
|-|-|-|-|
|userId|Integer|No|Primary key, foreign key references to Users(id)|
|songId|Integer|No|Primary key, foreign key references to Songs(id)|
|playCount|Integer|No|Count the number of times user listen to a song|
|createdAt|Timestamp|No||
|updatedAt|Timestamp|Yes||

<a name="playlists-songs-table"></a>
#### Playlists_songs table (Users - many to many - Songs)
|Column|Data type|Allow null|Description|
|-|-|-|-|
|playlistId|Integer|No|Primary key, foreign key references to Playlists(id)|
|songId|Integer|No|Primary key, foreign key references to Songs(id)|
|createdAt|Timestamp|No||
|updatedAt|Timestamp|Yes||

<a name="starting-project"></a>
## Starting the project
#### Run main server (express.js) - `http://localhost:3000`
```javascript
cd main-server
npm run devstart
```
#### Run server for machine learning (flask) - `http://localhost:5000`
```javascript
cd ml-server
python app.py
```

<a name="api-references"></a>
## API references
<a name="api-auth"></a>
#### Auth
Login
```http
POST /auth/login
```
```javascript
Request
    body: {
        "username": username,
        "password": password
    }
Response
    body: {
        "accessToken": user_access_token,
    }
    cookies: {
        "refreshToken": user_refresh_token
    }
```
Signup
```http
POST /auth/signup
```
```javascript
Request
    body: {
        "username": username,
        "password": password,
        "fullname": fullname,
        "email": email,
    }
Response
    body: {
        "accessToken": user_access_token,
    }
    cookies: {
        "refreshToken": user_refresh_token
    }
```
Refresh token
```http
GET /auth/refresh
```
```javascript
Request
    headers: {
        cookie: {
            refreshToken=user_refresh_token
        }
    }
Response
    body: {
        "accessToken": user_access_token,
    }
```
<a name="api-user"></a>
#### User
Get user information
```http
GET /users
```
```javascript
Request
    headers: {
        "authorization": "Bearer {user_access_token}"
    }
Response
    body: {
        "username": username,
        "email": email,
        "fullname": fullname
    }
```
Update user information
```http
PUT /users
```
```javascript
Request
    headers: {
        "authorization": "Bearer {user_access_token}"
    }
    body {
        "fullname": fullname,
        ...
    }
Response
    body: {
        "success": message
    }
```
<a name="api-song"></a>
#### Song
Get all songs
```http
GET /songs
```
```javascript
Response
    body: {
        "songs": [
            song1,
            song2,
            ...
        ],
        "page": current_page,
        "page_size": songs_per_page,
        "total_page": number_of_pages
    }
```
Get recommended songs for specific user
```http
GET /songs/for-you
```
```http
GET /songs/maybe-like
```
```javascript
Request
    headers: {
        "authorization": "Bearer {user_access_token}"
    }
Response
    body: {
        song1,
        song2,
        ...
    }
```
Get song by id
```http
GET /songs/{id}
```
```javascript
Response
    body: {
        "song": song_info,
        "artists": [
            artist1,
            artist2,
            ...
        ],
        "genres": [
            genre1,
            genre2,
            ...
        ]
    }
```
Get songs by pagination
```http
GET /songs?page={page}&pageSize={pageSize}
```
Get songs by title
```http
GET /songs?title={title}
```
<a name="api-artist"></a>
#### Artist
Get all artists
```http
GET /artists
```
Get artist by id
```http
GET /artists/{id}
```
Get aritsts by pagination
```http
GET /artists?page={page}&pageSize={pageSize}
```
Get artists by fullname
```http
GET /artists?fullname={fullname}
```
Get songs belongs to artist
```http
GET /artists/{id}/songs
```
```javascript
Response
    body: {
        "artist": artist_info,
        "songs": [
            song1,
            song2,
            ...
        ],
        "page": current_page,
        "page_size": songs_per_page,
        "total_page": number_of_pages
    }
```
<a name="api-genre"></a>
#### Genre
Get all genres
```http
GET /genres
```
Get genre by id
```http
GET /genres/{id}
```
Get genres by pagination
```http
GET /genres?page={page}&pageSize={pageSize}
```
Get genres by title
```http
GET /genres?title={title}
```
Get songs belongs to genre
```http
GET /genres/{id}/songs
```
<a name="api-favorite"></a>
#### Favorite
Get all songs in favorite list
```http
GET /favorites
```
Get songs in favorite list by pagination
```http
GET /favorites?page={page}&pageSize={pageSize}
```
Get songs in favorite list by title
```http
GET /favorites?title={title}
```
Add new song into favorite list
```http
POST /favorites
```
```javascript
Request
    body: {
        "songId": songId,
    }
```
Remove song from favorite list
```http
DELETE /favoriates/{songId}
```
<a name="api-playlist"></a>
#### Playlist
Get all playlists of user
```http
GET /playlists
```
```javascript
Request
    headers: {
        "authorization": "Bearer {user_access_token}"
    }
```
Get playlist with songs in it
```http
GET /playlists/{id}
```
Create new playlist
```http
POST /playlists
```
```javascript
Request
    headers: {
        "authorization": "Bearer {user_access_token}"
    }
    body: {
        "title": title,
        "description":description
    }
Response
    body: {
        "success": "playlist created successfully"
    }
```
Add song into playlist
```http
POST /playlists/{id}
```
```javascript
Request
    headers: {
        "authorization": "Bearer {user_access_token}"
    }
    body: {
        "songId": songId,
    }
Response
    body: {
        "success": "song is added to playlist successfully"
    }
Or Response
    body: {
        "error": "this song already exists in playlist"
    }
```
Update playlist by id
```http
PUT /playlists/{id} 
```
Delete playlist by id
```http
DELETE /playlists/{id}
```
Remove song from playlist
```http
DELETE /playlists/{id}/song
```
```javascript
Request
    headers: {
        "authorization": "Bearer {user_access_token}"
    }
    body: {
        "songId": songId
    }
```
<a name="api-history"></a>
#### Play history
Get history
```http
GET /history
```
```javascript
Request
    headers: {
        "authorization": "Bearer {user_access_token}"
    }
Response
    body: [
            song1,
            song2,
            ...
    ]
```
Add song into history
```javascript
Request
    headers: {
        "authorization": "Bearer {user_access_token}"
    }
    body: {
        "songId": songId
    }
Response
    body: {
        "success": "message"
    }
```