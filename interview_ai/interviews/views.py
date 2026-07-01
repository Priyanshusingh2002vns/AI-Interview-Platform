from rest_framework.response import Response
from rest_framework.decorators import api_view , permission_classes
from google import genai
from django.conf import settings
import random
from .models import InterviewResult

from django.contrib.auth.models import User

from rest_framework.permissions import IsAuthenticated

import re

from django.db.models import Avg

from rest_framework.parsers import MultiPartParser,FormParser

from pypdf import PdfReader
from docx import Document

from .gemini_client import generate_text



print(settings.GEMINI_API_KEYS[:15])

QUESTION_BANK = {
    "python": [
    "What is Python?",
    "What is OOP?",
    "What is a Decorator?",
    "What are Python's key features?",
    "What is the difference between a list and a tuple?",
    "What is the difference between == and is?",
    "What are Python data types?",
    "What is a dictionary in Python?",
    "What is a set in Python?",
    "What is list comprehension?",
    "What is the difference between append() and extend()?",
    "What are *args and **kwargs?",
    "What is a lambda function?",
    "What is the difference between deep copy and shallow copy?",
    "What are modules and packages?",
    "What is PEP 8?",
    "What is the difference between break, continue, and pass?",
    "What are Python generators?",
    "What is the yield keyword?",
    "What is exception handling in Python?",
    "What is the difference between a function and a method?",
    "What is inheritance in Python?",
    "What is polymorphism?",
    "What is encapsulation?",
    "What is abstraction?",
    "What is method overloading in Python?",
    "What is method overriding?",
    "What are class methods and static methods?",
    "What is the __init__ method?",
    "What is the self keyword?",
    "What is the difference between class variables and instance variables?",
    "What are magic methods in Python?",
    "What is the purpose of __str__ and __repr__?",
    "What is multithreading in Python?",
    "What is multiprocessing in Python?",
    "What is the Global Interpreter Lock (GIL)?",
    "What is the difference between threading and multiprocessing?",
    "What are iterators in Python?",
    "What is the difference between an iterator and a generator?",
    "What is a virtual environment?",
    "How do you install packages in Python?",
    "What is pip?",
    "What is the difference between remove(), pop(), and del?",
    "What is file handling in Python?",
    "How do you read and write files in Python?",
    "What is JSON and how is it handled in Python?",
    "What is the difference between sort() and sorted()?",
    "What are decorators used for?",
    "What is recursion?",
    "What are Python namespaces?",
    "What is variable scope in Python?",
    "What is monkey patching?",
    "What is duck typing?"
],

    "django": [
        "What is Django ORM?",
        "What is Middleware?",
        "What is Authentication?"
    ],

    "react": [
        "What is React?",
        "What is State?",
        "What are Props?"
    ],

    "sql": [
        "What is SQL?",
        "What is JOIN?",
        "What is DML?"
    ]
}




# client = genai.Client(
#     api_key=settings.GEMINI_API_KEY
# )






@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_question(request):

    tech = request.GET.get('tech')

    if tech not in QUESTION_BANK:
        return Response(
            {
                "error": "Invalid technology. Use python, django, react, or sql."
            },
            status=400
        )

    question = random.choice(QUESTION_BANK[tech])

    return Response(
        {
            "technology": tech,
            "question": question
        }
    )




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def evaluate_answer(request):

    user_question = request.data.get('question')
    answer = request.data.get('answer')

    if not user_question or not answer:
        return Response(
            {
                "error": "Question and Answer are required."
            },
            status=400
        )

    prompt = f"""
You are a technical interviewer.

Question:
{user_question}

Candidate Answer:
{answer}

Evaluate the answer and return:

Score: <score>/10

Feedback:
<feedback>

Correct Answer:
<correct answer>


"""

    try:

        # response = client.models.generate_content(
        #     model="gemini-2.5-flash",
        #     contents=prompt
        # )
        response_text=generate_text(prompt)

        score=0
        match=re.search(r"Score:\s*(\d+)/10",response_text)

        if match:
            score=int(match.group(1))

        technology=request.data.get("technology")

        InterviewResult.objects.create(
            user=request.user,
            technology=technology,
            question=user_question,
            answer=answer,
            score=score,
            feedback=response_text,
            correct_answer=""
        )

        

        return Response(
            {
                "question": user_question,
                "answer": answer,
                "score":score,
                "feedback": response_text
            }
        )
    except Exception as e:
        print("GEMINI ERROR:", e)

        return Response(
            {"error": str(e)},
            status=500
        )

  
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def interview_history(request):
    interviews=InterviewResult.objects.filter(
        user=request.user
    ).order_by('created_at')

    data=[]

    for interview in interviews:
        data.append({"id": interview.id,
                     "technology":interview.technology,
                     "question":interview.question,
                     "answer":interview.answer,
                     "score":interview.score,
                     "feedback":interview.feedback,
                     "created_at":interview.created_at
                     })
        
    return Response(data)

@api_view(['POST'])
def register(request):

    username=request.data.get('username')
    password=request.data.get('password')

    if not username or not password:
        return Response(
            {"erroe":"Username and password required"},
            status=400
        )
    if User.objects.filter(username=username).exists():
        return Response(
            {"erroe":"User already exists"},
            status=400
        )
    User.objects.create_user(
        username=username,
        password=password
    )
    return Response({
        "message":"User created successfully"
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):

    print("NEW DASHBOARD FUNCTION RUNNING")

    total=InterviewResult.objects.filter(
        user=request.user).count()
    
    python_count=InterviewResult.objects.filter(
        user=request.user,
        technology="python").count()

    django_count=InterviewResult.objects.filter(
        user=request.user,
        technology="django"
    ).count()

    react_count=InterviewResult.objects.filter(
        user=request.user,
        technology="react"
    ).count()

    sql_count=InterviewResult.objects.filter(
        user=request.user,
        technology="sql"
    ).count()

    avg_score=InterviewResult.objects.filter(
        user=request.user
    ).aggregate(avg_score=Avg("score"))

    print(avg_score)

    return Response({
        "total":total,
        "python":python_count,
        "django":django_count,
        "react":react_count,
        "sql":sql_count,
        "avarage_score":avg_score["avg_score"] or 0
    })

def extract_cv_text(cv):
    filename=cv.name.lower()

    if filename.endswith(".txt"):
        return cv.read().decode("utf-8",errors="ignore")
    
    elif filename.endswith(".pdf"):
        reader=PdfReader(cv)

        text=""

        for page in reader.pages:
            page_text=page.extract_text()

            if page_text:
                text += page_text + "\n"

        return text
    
    elif filename.endswith(".docx"):
        document=Document(cv)

        text=""

        for para in document.paragraphs:
            text += para.text + "\n"

        return text
    else:
        raise Exception("Unsupported file format")
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cv_question(request):

    cv = request.FILES.get("cv")

    if not cv:
        return Response({"error": "CV is required"}, status=400)

    
    # cv_text = cv.read().decode("utf-8", errors="ignore")
    try:
        cv_text=extract_cv_text(cv)
    except Exception as e:
        return Response(
            {"error":str(e)},
            status=400
        )

    prompt = f"""
You are an experienced technical interviewer.

Below is the candidate's resume.

Resume:
{cv_text}

Generate exactly 10 interview questions.

Rules:
- Ask only from the resume.
- Start with easy questions.
- Gradually increase difficulty.
- Ask about projects.
- Ask about skills.
- End with one HR question.

Return ONLY a numbered list.

Example:

1. Tell me about yourself.
2. Explain your Django project.
3. What is JWT?
"""

    try:
        questions_text =generate_text(prompt)
        questions = re.findall(r"\d+\.\s*(.*)", questions_text)
        return Response({
            "questions":questions
        })

        # response = client.models.generate_content(
        #     model="gemini-2.5-flash",
        #     contents=prompt
        # )

        

        # return Response({
        #     "questions": questions
        # })

    except Exception as e:
        import traceback
        traceback.print_exc()

        return Response(
            {"error": str(e)},
            status=500
        )
   
   
    # try:
    #     response=client.models.generate_content(
    #         model="gemini-2.5-flash",
    #         contents=prompt
    #     )

    #     return Response({
    #         "question": response.text
    #     })
    # except Exception as e:
    #     import traceback

    #     traceback.print_exc()
    #     print(e)
    #     return Response(
    #         {"error":str(e)},
    #         status=500
    #     )
        


    