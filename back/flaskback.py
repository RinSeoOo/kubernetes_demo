from flask import Flask, request, jsonify
import os
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MySQL 연결 설정
def create_connection():
    try:
        connection = mysql.connector.connect(
            host='mysql-service', # 10.0.20.131 / localhost
            user='root',
            password='1234',
            database='myappdb'
        )
        if connection.is_connected():
            db_info = connection.get_server_info()
            print(f"MySQL Server version {db_info}의 데이터베이스 연결에 성공했습니다.")
            cursor = connection.cursor()
            cursor.execute("SELECT DATABASE();")
            record = cursor.fetchone()
            print(f"연결된 데이터베이스: {record[0]}")
        return connection
    except Error as e:
        print(f"MySQL 연결 오류: {e}")
        return None

# MySQL 연결 테스트 엔드포인트
@app.route('/test-db')
def test_db():
    connection = create_connection()
    if connection:
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT DATABASE();")
            record = cursor.fetchone()
            response = {
                "success": True,
                "message": "데이터베이스 연결에 성공했습니다.",
                "database": record[0]
            }
        except Error as e:
            response = {
                "success": False,
                "message": f"데이터베이스를 갖고오는데 실패했습니다.: {str(e)}"
            }
        finally:
            cursor.close()
            connection.close()
    else:
        response = {
            "success": False,
            "message": "데이터베이스 연결에 실패했습니다."
        }
    
    return jsonify(response)



# 로그인 엔드포인트
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    connection = create_connection()
    if not connection:
        return jsonify({'error': '데이터베이스 연결에 실패했습니다.'}), 500

    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM user WHERE username = %s AND password = %s", (username, password))
    user = cursor.fetchone()
    cursor.close()
    connection.close()

    if user:
        return jsonify({'message': 'Login successful', 'score': user['score']}), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 400

# 점수 업데이트 엔드포인트
@app.route('/update-score', methods=['POST'])
def update_score():
    data = request.json
    username = data.get('username')
    new_score = data.get('score')

    # new_score가 None인 경우 처리
    if new_score is None:
        return jsonify({'error': 'newScore is required and cannot be null'}), 400
        
    connection = create_connection()
    if not connection:
        return jsonify({'error': '데이터베이스 연결에 실패했습니다.'}), 500

    cursor = connection.cursor()
    cursor.execute("UPDATE user SET score = %s WHERE username = %s", (new_score, username))
    connection.commit()
    cursor.close()
    connection.close()

    return jsonify({'message': '점수가 성공적으로 업데이트되었습니다.'}), 200


@app.route('/')
def home():
    return "hello world!"

if __name__ == '__main__':
    connection = create_connection()
    app.run(host='0.0.0.0', port='5000', debug=True)
