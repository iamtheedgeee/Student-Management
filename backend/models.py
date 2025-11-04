from db import db

class Scores(db.Model):
    __tablename__='scores'
    id=db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_name=db.Column(db.String(30), unique=True, nullable=False)
    first_assessment=db.Column(db.Integer)
    second_assessment=db.Column(db.Integer)
    exam_score=db.Column(db.Integer)
    total=db.Column(db.Integer)
    grade=db.Column(db.String(1))

    def __repr__(self):
        return f'<Score {self.student_name}'


    