from flask import Flask, request
import mysql.connector, pandas as pd
app = Flask(__name__)

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


    

@app.route('/helloworld', methods=['GET'])
def home():
    return 'hello world'

if __name__ == '__main__':
    app.run(port=5000)