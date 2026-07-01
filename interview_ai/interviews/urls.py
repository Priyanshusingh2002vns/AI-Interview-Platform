from django.urls import path
from .views import *

urlpatterns = [
    path('get_question/',get_question),
    path('evaluate_answer/',evaluate_answer),
    path('interview_history/',interview_history),
    path('register/',register),
    path('dashboard_stats/',dashboard_stats),
    path('cv_question/',cv_question),
    
]
