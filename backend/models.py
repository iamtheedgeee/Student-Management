from db import db

class Scores(db.Model):
    __tablename__='scores'
    student_name=db.Column(db.String(30),primary_key=True)
    first_assessment=db.Column(db.Integer)
    second_assessment=db.Column(db.Integer)
    exam_score=db.Column(db.Integer)

    def __repr__(self):
        return f'<Score {self.student_name}'


    