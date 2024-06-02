import pandas as pd
import mysql.connector
import time, random

db_host = "localhost"
db_name = "music_server"
db_user = "root"
db_password = ""

df = pd.read_csv("C:/Users/HP/Desktop/ratings.csv")

try:
    connection = mysql.connector.connect(host=db_host, database=db_name, user=db_user, password=db_password)
    cursor = connection.cursor()
except mysql.connector.Error as err:
    print("Error connecting to database:", err)
    exit()
    
    
# query = f"SELECT id, title FROM genres"
# cursor.execute(query)
# df_genres = pd.DataFrame(cursor.fetchall(), columns=['id', 'title'])
# genres = {}
# for i in range(0, len(df_genres)):
#     genres[ df_genres['title'][i]] = df_genres['id'][i]

# attributes = ['rock viet','vietnamese bolero','indie viet','vietnamese trap','vietnamese hip hop','viet remix','viet lo-fi','v_pop','v_rap']

# df = pd.DataFrame(df[attributes], columns=attributes)

# for i in range(0, len(df)):
#     for j in attributes:
#         if (df[j][i] == 1):
#             query = f"INSERT INTO songs_genres VALUES ({i+1}, {genres[j]})"
#             cursor.execute(query)
#             connection.commit() 
    
# for i in range(0, len(df)):
#     query = f"INSERT INTO songs_artists VALUES ({i+1}, {artists[df['artist_name'][i]]})"
#     cursor.execute(query)
#     connection.commit()
# print("ok")


# attributes = ['title', 'mode', 'bpm', 'popularity', 'danceability', 'energy', 'loudness', 'speechiness', 'acousticness', 'liveness', 'valence', 'releasedYear']

# df = pd.DataFrame(df[attributes], columns=attributes)

# attributes.insert(0, 'id')
# # add main table
# index = 1
# for row in df.values:
#     arr = (index, *row)
#     insert_query = f"INSERT INTO songs {'(' + ','.join(attributes) + ')'} VALUES {arr}"
#     cursor.execute(insert_query)
#     connection.commit()
#     index += 1
# print("inserted successfully")

# # add intermediate table in many to many relationship
# for i in range(0, len(df["genres"])):
    
#     releasedYear = df["releasedYear"][i]
#     select_query = f"SELECT id FROM songs WHERE title=%s AND releasedYear={releasedYear}"
#     cursor.execute(select_query, (df["title"][i],))
#     song = cursor.fetchone()
    
#     arr = df["genres"][i].split(', ')
#     select_query = f"SELECT id FROM genres WHERE {'title=%s OR '*(len(arr)-1)}title=%s"
#     cursor.execute(select_query, tuple(arr))
#     genres = cursor.fetchall()
#     middle = [(song[0], genre[0]) for genre in genres]
    
#     for row in middle:     
#         insert_query = f"INSERT INTO songs_genres (songId, genreId) VALUES (%s,%s)"
#         cursor.execute(insert_query, tuple(row))
#         connection.commit()

# # auto listen song
# select_query = f"SELECT id FROM users ORDER BY id ASC"
# cursor.execute(select_query)
# userIds = cursor.fetchall()
# userIds = [item[0] for item in userIds]

# select_query = f"SELECT id FROM songs ORDER BY id ASC"
# cursor.execute(select_query)
# songIds = cursor.fetchall()
# songIds = [item[0] for item in songIds]
  
# delay_time = 100    # 1 minute
# for userId in userIds:
#     for i in range (0, random.randint(50, 200)):
#         songId = random.choice(songIds)
#         playCount = random.randint(1,30)
#         insert_query = f"INSERT INTO play_history (userId, songId, playCount, createdAt) VALUES (%s, %s, 1, '2024-01-01 23:59:00') ON DUPLICATE KEY UPDATE playCount = {random.randint(2,15)}, updatedAt = current_timestamp()-{delay_time}"
#         cursor.execute(insert_query, tuple([userId, songId]))
#         connection.commit()
#         delay_time += 1000

if connection:
    cursor.close()
    connection.close()
    print("Connection to database closed")