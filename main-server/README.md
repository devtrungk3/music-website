# Database structure
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

#### Artists table
|Column|Data type|Allow null|Description|
|-|-|-|-|
|id|Integer|No|Primary key, auto increment|
|fullname|String|No||
|nationality|String|No||
|image|String|Yes|Path to image file of artist|

#### Genres table
|Column|Data type|Allow null|Description|
|-|-|-|-|
|id|Integer|No|Primary key, auto increment|
|title|String|No||

#### Playlists table
|Column|Data type|Allow null|Description|
|-|-|-|-|
|id|Integer|No|Primary key, auto increment|
|title|String|No||
|description|String|Yes||
|userId|Integer|No|Foreign key references to Users(id)|

#### Songs_artists table (Songs - many to many - Artists)
|Column|Data type|Allow null|Description|
|-|-|-|-|
|songId|Integer|No|Primary key, foreign key references to Songs(id)|
|artistId|Integer|No|Primary key, foreign key references to Artists(id)|

#### Songs_genres table (Songs - many to many - Genres)
|Column|Data type|Allow null|Description|
|-|-|-|-|
|songId|Integer|No|Primary key, foreign key references to Songs(id)|
|genreId|Integer|No|Primary key, foreign key references to Genres(id)|

#### Favorites table (Users - many to many - Songs)
|Column|Data type|Allow null|Description|
|-|-|-|-|
|userId|Integer|No|Primary key, foreign key references to Users(id)|
|songId|Integer|No|Primary key, foreign key references to Songs(id)|
|createdAt|Timestamp|No||
|updatedAt|Timestamp|Yes||

#### Play_history table (Users - many to many - Songs)
|Column|Data type|Allow null|Description|
|-|-|-|-|
|userId|Integer|No|Primary key, foreign key references to Users(id)|
|songId|Integer|No|Primary key, foreign key references to Songs(id)|
|playCount|Integer|No|Count the number of times user listen to a song|
|createdAt|Timestamp|No||
|updatedAt|Timestamp|Yes||

#### Playlists_songs table (Users - many to many - Songs)
|Column|Data type|Allow null|Description|
|-|-|-|-|
|playlistId|Integer|No|Primary key, foreign key references to Playlists(id)|
|songId|Integer|No|Primary key, foreign key references to Songs(id)|
|createdAt|Timestamp|No||
|updatedAt|Timestamp|Yes||

# API reference
### Auth
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
### User
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
### Song
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
### Artist
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
### Genres
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
### Favorite
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
### Playlist
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
### Play history
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
