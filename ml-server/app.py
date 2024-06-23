from flask import Flask, jsonify
from flask_cors import CORS

from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from sqlalchemy import create_engine

password = ''
engine = create_engine(f'mysql+pymysql://root:{password}@localhost/music_server')
app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

    
@app.route('/for-you/<int:userId>', methods=['GET'])
def forYou(userId):
    query = "SELECT s.*, sa.artistId FROM songs AS s JOIN songs_artists AS sa on s.id = sa.songId"
    songs_df = pd.read_sql(query, engine)
    attributes = songs_df.columns
    songs_df = songs_df.select_dtypes(exclude=['object'])
    attributes = songs_df.columns.tolist()[1:]
    scaler = StandardScaler()
    songs_df[attributes] = scaler.fit_transform(songs_df[attributes])
    
    query = f"SELECT songId FROM play_history WHERE userId = '{userId}' ORDER BY playCount desc limit 1"
    df = pd.read_sql(query, engine)
    songId = 1  
    if not df.empty:
        songId = df['songId'].iloc[0]
    else:
        query = f"SELECT songId, SUM(playCount) AS playCount FROM play_history GROUP BY songId ORDER BY playCount DESC;"
        df = pd.read_sql(query, engine)
        songId = df['songId'].iloc[0]

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
    similar_songs = find_similar_songs(songId, songs_df, attributes, top_n=10)
    return jsonify({'songs': similar_songs})

def get_user_recommendations(userId, user_item_matrix, user_similarity_df, num_recommendations=10):
    # Get the similarity scores for the given user
    user_similarities = user_similarity_df.loc[userId]

    # Exclude the given user from their own similarity scores
    user_similarities = user_similarities.drop(userId)

    # Get the indices of the most similar users
    similar_user_indices = user_similarities.nlargest(num_recommendations).index

    # Get the songs played by the similar users
    similar_users_songs = user_item_matrix.loc[similar_user_indices]

    # Compute the weighted sum of play counts for each song
    song_recommendation_scores = similar_users_songs.T.dot(user_similarities.loc[similar_user_indices])
    
    # Normalize the scores by the sum of the similarity scores
    song_recommendation_scores = song_recommendation_scores / user_similarities.loc[similar_user_indices].sum()

    # Sort the songs by recommendation score
    recommended_songs = song_recommendation_scores.sort_values(ascending=False)

    # Exclude songs already played by the user
    user_played_songs = user_item_matrix.loc[userId]
    recommended_songs = recommended_songs.drop(user_played_songs[user_played_songs > 0].index, errors='ignore')

    # Return the top recommendations
    return recommended_songs.head(num_recommendations)

@app.route('/maybe-like/<int:userId>', methods=['GET'])
def maybeLike(userId):
    query = "SELECT userId, songId, playCount FROM play_history"
    history_df = pd.read_sql(query, engine)
    
    # Create user-song matrix
    user_item_matrix = history_df.pivot(index='userId', columns='songId', values='playCount').fillna(0)

    # Compute cosine similarity between users
    user_similarity = cosine_similarity(user_item_matrix)

    user_similarity_df = pd.DataFrame(user_similarity, index=user_item_matrix.index, columns=user_item_matrix.index)
    
    recommendations = get_user_recommendations(userId, user_item_matrix, user_similarity_df)
    return jsonify({'songs': recommendations.index.tolist()})

@app.route('/helloworld', methods=['GET'])
def home():
    return 'hello world'
    

if __name__ == '__main__':
    app.run(port=5000, debug=True, threaded=True)