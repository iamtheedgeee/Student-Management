from flask import Flask,jsonify, request
import pandas as pd
from flask_cors import CORS
from models import Scores
from db import db
import os
from dotenv import load_dotenv
from sqlalchemy.exc import IntegrityError, OperationalError
from sqlalchemy.orm.exc import NoResultFound

#load_dotenv()
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

## app.app_context():
  ##  Scores.__table__.drop(db.engine)
    ##db.create_all()
 

def error_response(message, status_code=400):
    return jsonify({"success": False, "error": {"message": message}}), status_code

@app.errorhandler(ValueError)
def handle_value_error(e):
    return error_response(str(e), 400)

@app.errorhandler(IntegrityError)
def handle_integrity_error(e):
    return error_response("Database constraint violated", 400)

@app.errorhandler(NoResultFound)
def handle_not_found(e):
    return error_response("Resource not found", 404)

@app.errorhandler(OperationalError)
def handle_db_unavailable(e):
    return error_response("Database unavailable", 503)

@app.errorhandler(Exception)
def handle_generic_exception(e):
    app.logger.error(f"Unexpected error: {e}", exc_info=True)
    return error_response("Internal server error", 500)


@app.route('/get-results',methods=["GET"])
def get_result():
    results=Scores.query.all()
    results_json = [ {
        "id":result.id,
        "student_name":result.student_name,
        "first_assessment":result.first_assessment,
        "second_assessment":result.second_assessment,
        "exam_score":result.exam_score,
        "total":result.total,
        "grade":result.grade
    } for result in results]
    return jsonify({
        "success":True,
        "data":{
            "results":results_json
        }
    }),200

@app.route('/post-result',methods=['POST'])
def input_result():
    data=request.get_json()
    new_score=Scores(
        student_name=data['student_name'],
        first_assessment=data['first_assessment'],
        second_assessment=data['second_assessment'],
        exam_score=data['exam_score'],
    )
    db.session.add(new_score)
    db.session.commit()
    return jsonify({
        "success":True,
        "data":{
            "recieved":data
        } 
    }),201




@app.route('/import-result',methods=['POST'])
def import_result():
    if 'spreadSheetFile' not in request.files:
        error_response("No file part",400)
    file=request.files['spreadSheetFile']
    if file.filename=='':
        error_response("No selected file",400)
    frame=pd.read_excel(file)
    data=frame.to_dict(orient='records')
    new_scores=[Scores(
        student_name=rows['student_name'],
        first_assessment=int(rows['first_assessment']),
        second_assessment=int(rows['second_assessment']),
        exam_score=int(rows['exam_score']),
    ) for rows in data]
    db.session.add_all(new_scores)
    db.session.commit()
    return jsonify({
        "success":True,
        "data":{
            "count":len(new_scores)
        }
    }),201
    

@app.route("/delete-result", methods=["DELETE"])
def delete_users():
    data = request.get_json()
    selected=data['selected']
    if not selected:
        error_response("No Names Given",400)
    scores = Scores.query.filter(Scores.student_name.in_(selected)).all()
    if not scores:
        error_response("No matching results",400)
    for score in scores:
        db.session.delete(score)
    db.session.commit()
    return jsonify({
        "success":True,
        "data":{
            "count":len(scores)
        }
    }),204

@app.route("/edit-result/<int:id>", methods=['PATCH'])
def edit_result(id):
    score=Scores.query.get_or_404(id)
    data=request.get_json()
    field_name=data["name"]
    data_value=data["data"]
    setattr(score,field_name,data_value)
    db.session.commit()
    return jsonify({
        "success":True,
    }),204
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)),debug=True)
 