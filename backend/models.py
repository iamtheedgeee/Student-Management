from db import db
from sqlalchemy import CheckConstraint,event

def get_grade(total):
    if total>=70:
        grade="A"
    elif total>=60:
        grade="B"
    elif total>=50:
        grade="C"
    elif total>=40:
        grade="D"
    elif total>=30:
        grade="E"
    else:
        grade="F"
    return grade

class Scores(db.Model):
    __tablename__='scores'
    id=db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_name=db.Column(db.String(30), unique=True, nullable=False)
    first_assessment=db.Column(db.Integer,CheckConstraint('first_assessment >= 0 AND first_assessment <= 15', name='first_assessment_range'))
    second_assessment=db.Column(db.Integer,CheckConstraint('second_assessment >= 0 AND second_assessment <= 15', name='second_assessment_range'))
    exam_score=db.Column(db.Integer,CheckConstraint('exam_score >= 0 AND exam_score <= 70', name='exam_score_range'))
    total=db.Column(db.Integer)
    grade=db.Column(db.String(1))

    def __repr__(self):
        return f'<Score {self.student_name}'


@event.listens_for(Scores, "before_insert")
@event.listens_for(Scores, "before_update")
def validate_and_calculate(mapper, connection, target):
    for field in ["first_assessment", "second_assessment", "exam_score"]:
        value = int(getattr(target, field))
        if field=="first_assessment" or field=="second_assessment":
            if not(0<=value<=15):
                raise ValueError(f"{field} must be between 0 and 15")
        if field=="exam_score":
            if not(0<=value<=70):
                raise ValueError(f"{field} must be between 0 and 70")
    if field=="student_name":
        value=str(getattr(target,field))
        if(len(value)>25):
            raise ValueError(f"Student name must not be more than 25 characters") 
    scores = [
        int(getattr(target, "first_assessment"))or 0,
        int(getattr(target, "second_assessment"))or 0,
        int(getattr(target, "exam_score")) or 0
    ]
    target.total = sum(scores)
    target.grade=get_grade(sum(scores))