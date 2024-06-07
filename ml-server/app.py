from flask import Flask, jsonify
from flask_cors import CORS

from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
import mysql.connector, pandas as pd

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

# mysql connector
try:
    connection = mysql.connector.connect(
        host="localhost", 
        database="music_server", 
        user="root", password="")
    cursor = connection.cursor()
except mysql.connector.Error as err:
    print("Error connecting to database:", err)
    exit()
    
@app.route('/for-you/<int:userId>', methods=['GET'])
def forYou(userId):
    query = "SELECT * FROM songs"
    cursor.execute(query)
    data = cursor.fetchall()
    attributes = [i[0] for i in cursor.description]
    songs = pd.DataFrame(data, columns=attributes)
    songs = songs.select_dtypes(exclude=['object'])
    attributes = songs.columns.tolist()[1:]
    scaler = StandardScaler()
    songs[attributes] = scaler.fit_transform(songs[attributes])
    
    query = "SELECT songId FROM play_history WHERE userId = %s ORDER BY playCount desc limit 1"
    cursor.execute(query, (userId,))
    songId = cursor.fetchone()[0]

    def find_similar_songs(song_id, df, features, top_n=10):
        # Get the features of the given song
        song_features = df[df['id'] == song_id][features].values
        
        # Calculate cosine similarity
        similarity = cosine_similarity(song_features, df[features].values)

        # Get the top N similar songs
        df['similarity'] = similarity[0]
        
        similar_songs = df.sort_values(by='similarity', ascending=False)[1:top_n+1]
        
        return similar_songs['id'].values.tolist()

    # Find similar songs
    similar_songs = find_similar_songs(songId, songs, attributes, top_n=10)
    return jsonify({'songs': similar_songs})
    

@app.route('/helloworld', methods=['GET'])
def home():
    return 'hello world'

if __name__ == '__main__':
    app.run(port=5000, debug=True)