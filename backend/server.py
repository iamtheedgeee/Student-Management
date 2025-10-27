from flask import Flask,jsonify, request
import pandas as pd
from flask_cors import CORS
from models import Scores
from db import db
import os
from dotenv import load_dotenv
load_dotenv(".env.production")

app=Flask(__name__)

CORS(app,supports_credentials=True, origins=['http://localhost:3000','https://student-management-two-snowy.vercel.app'])

DB_NAME=os.getenv("DB_NAME")
PASSWORD=os.getenv("PASSWORD")
USER=os.getenv("USER")
HOST=os.getenv("HOST")
DB_PORT=os.getenv("DB_PORT")

app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{USER}:{PASSWORD}@{HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()
    

@app.route('/')
def home():
    return jsonify(message="Hello From flask")

@app.route('/get-results',methods=["GET"])
def get_result():
    print('getting')
    try:
        results=Scores.query.all()
        results_json = [ {
            "student_name":result.student_name,
            "first_assessment":result.first_assessment,
            "second_assessment":result.second_assessment,
            "exam_score":result.exam_score
        } for result in results]
        return jsonify(results=results_json),200
    except:
        return jsonify(error="Error in fetching results"),400

@app.route('/post-result',methods=['POST'])
def input_result():
    data=request.get_json()
    new_score= Scores(
        student_name=data['student_name'],
        first_assessment=data['first_assessment'],
        second_assessment=data['second_assessment'],
        exam_score=data['exam_score']
    )
    try:
        db.session.add(new_score)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify(error=str(e)),500
    return jsonify(recieved=data),201

@app.route('/import-result',methods=['POST'])
def import_result():
    if 'spreadSheetFile' not in request.files:
        return jsonify({'error':'No file part'}),400
    file=request.files['spreadSheetFile']

    if file.filename=='':
        return jsonify({'error': 'No selected file'}), 400
    try:
        frame=pd.read_excel(file)
        data=frame.to_dict(orient='records')
        new_scores=[Scores(
            student_name=rows['student_name'],
            first_assessment=int(rows['first_assessment']),
            second_assessment=int(rows['second_assessment']),
            exam_score=int(rows['exam_score'])
        ) for rows in data]
        db.session.add_all(new_scores)
        db.session.commit()
        return jsonify(msg=len(new_scores)),201
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify(error='Error in importing file'),400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
